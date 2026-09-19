import type { LLMProvider } from './providers/types';
import { getActiveProviders } from './providers';

const PROVIDER_TIMEOUT_MS = 90000;
/** Longer chats — OmniRouter / Engine 2 */
const MAX_MESSAGE_LENGTH = 12000;
const MAX_SYSTEM_EXTRA = 8000;

// ============================================
// VEDAI HYBRID BRAIN ENGINE 2 (OmniRouter)
// Multi-provider cascade — never runs out of tokens
// Order: free tiers first, then paid keys, then static
// ============================================

export async function* streamChat(
  message: string,
  systemPrompt: string,
  chartData?: Record<string, unknown>,
): AsyncGenerator<{ chunk: string; provider: string }> {
  const trimmed = message.trim().slice(0, MAX_MESSAGE_LENGTH);
  if (!trimmed) return;

  let fullPrompt = systemPrompt;
  if (chartData) {
    const chartJson = JSON.stringify(chartData, null, 2).slice(0, MAX_SYSTEM_EXTRA);
    fullPrompt += `\n\nTHE USER'S BIRTH CHART:\n${chartJson}\nUse this chart data to give personalized readings.`;
  }

  const providers = getActiveProviders();

  for (const provider of providers) {
    // Extra retries on gateway providers (OpenRouter / free routers)
    const attempts =
      provider.slug === 'openrouter' || provider.slug === 'groq' ? 3 : 1;

    for (let attempt = 1; attempt <= attempts; attempt++) {
      let timeout: ReturnType<typeof setTimeout> | undefined;
      try {
        console.log(`[VedAI Omni] Trying ${provider.name} (attempt ${attempt}/${attempts})`);

        const controller = new AbortController();
        timeout = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);

        const apiKey = provider.getApiKey();
        const url = provider.slug === 'gemini'
          ? `${provider.url}?key=${apiKey}`
          : provider.url;

        const response = await fetch(url, {
          method: 'POST',
          headers: provider.buildHeaders(apiKey || ''),
          body: provider.buildBody(trimmed, fullPrompt),
          signal: controller.signal,
        });

        if (!response.ok) {
          clearTimeout(timeout);
          const err = await response.text().catch(() => '');
          console.error(`[VedAI Omni] ${provider.name} HTTP ${response.status}:`, err.slice(0, 200));
          // Rate limit → try next attempt or next provider
          if (response.status === 429 || response.status === 503) continue;
          break;
        }

        console.log(`[VedAI Omni] ${provider.name} SUCCESS`);
        yield* streamFromProvider(provider, response);
        clearTimeout(timeout);
        return;

      } catch (err: unknown) {
        if (timeout) clearTimeout(timeout);
        const isTimeout = err instanceof DOMException && err.name === 'AbortError';
        console.error(`[VedAI Omni] ${provider.name} ${isTimeout ? 'TIMEOUT' : 'CRASHED'}:`, err);
      }
    }
  }

  console.log('[VedAI Omni] All streaming failed, trying non-streaming Groq...');
  const fallback = providers.find((p) => p.slug === 'groq');
  if (fallback?.getApiKey()) {
    const result = await tryNonStreaming(fallback, trimmed, fullPrompt);
    if (result) {
      yield { chunk: result, provider: 'groq-fallback' };
      return;
    }
  }

  // OpenRouter non-stream last try
  const or = providers.find((p) => p.slug === 'openrouter');
  if (or?.getApiKey()) {
    const result = await tryNonStreaming(or, trimmed, fullPrompt);
    if (result) {
      yield { chunk: result, provider: 'openrouter-fallback' };
      return;
    }
  }

  yield { chunk: getStaticFallback(chartData), provider: 'static' };
}

async function* streamFromProvider(provider: LLMProvider, response: Response) {
  const decoder = new TextDecoder();
  const reader = response.body?.getReader();
  if (!reader) return;

  let buffer = '';

  if (provider.slug === 'gemini') {
    yield* streamGeminiResponse(reader, decoder);
    return;
  }

  if (provider.slug === 'ollama') {
    yield* streamOllamaResponse(reader, decoder);
    return;
  }

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const result = provider.parseStreamChunk(line);
        if (result === '__DONE__') return;
        if (result) yield { chunk: result, provider: provider.name };
      }
    }
  } catch (err) {
    console.error(`[VedAI Omni] ${provider.name} stream read error:`, err);
    throw err;
  }
}

async function* streamGeminiResponse(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  decoder: TextDecoder,
) {
  let buffer = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      while (true) {
        const arrayStart = buffer.indexOf('[');
        if (arrayStart === -1) break;

        let depth = 0;
        let endIdx = -1;
        for (let i = arrayStart; i < buffer.length; i++) {
          if (buffer[i] === '[') depth++;
          if (buffer[i] === ']') depth--;
          if (depth === 0) { endIdx = i; break; }
        }

        if (endIdx === -1) break;

        try {
          const arr = JSON.parse(buffer.slice(arrayStart, endIdx + 1));
          for (const item of arr) {
            const text = item?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) yield { chunk: text, provider: 'Gemini' };
          }
          buffer = buffer.slice(endIdx + 1);
        } catch {
          buffer = buffer.slice(endIdx + 1);
        }
      }
    }
  } catch (err) {
    console.error('[VedAI Omni] Gemini stream error:', err);
    throw err;
  }
}

async function* streamOllamaResponse(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  decoder: TextDecoder,
) {
  let buffer = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.done) return;
          if (parsed.message?.content) {
            yield { chunk: parsed.message.content, provider: 'Ollama' };
          }
        } catch { /* skip */ }
      }
    }
  } catch (err) {
    console.error('[VedAI Omni] Ollama stream error:', err);
    throw err;
  }
}

async function tryNonStreaming(
  provider: LLMProvider,
  message: string,
  systemPrompt: string,
): Promise<string | null> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    const controller = new AbortController();
    timeout = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);

    let body: string;
    if (provider.slug === 'gemini') {
      body = JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: message }] }],
        generationConfig: { temperature: 0.7 },
      });
    } else {
      const parsed = JSON.parse(provider.buildBody(message, systemPrompt));
      parsed.stream = false;
      body = JSON.stringify(parsed);
    }

    const apiKey = provider.getApiKey();
    const url = provider.slug === 'gemini'
      ? `${provider.url.replace(':streamGenerateContent', ':generateContent')}?key=${apiKey}`
      : provider.url;

    const response = await fetch(url, {
      method: 'POST',
      headers: provider.buildHeaders(apiKey || ''),
      body,
      signal: controller.signal,
    });

    clearTimeout(timeout);
    if (!response.ok) return null;

    const data = await response.json();
    if (provider.slug === 'gemini') {
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    }
    return data?.choices?.[0]?.message?.content || null;
  } catch {
    if (timeout) clearTimeout(timeout);
    return null;
  }
}

function getStaticFallback(chartData?: Record<string, unknown>): string {
  if (chartData) {
    const planets = Array.isArray(chartData.planets) ? chartData.planets : [];
    const summary = (planets as Array<Record<string, unknown>>)
      .filter((p) => p.name)
      .map((p) => `- ${p.name} in ${p.sign || '?'}${p.retrograde ? ' (R)' : ''}`)
      .join('\n');

    return `Namaste! My cosmic channels are temporarily busy, but I can see your birth chart:\n\n${summary || '(Chart data unavailable)'}\n\nPlease try again in a moment for a detailed reading.`;
  }

  return 'Namaste! All AI channels are temporarily busy. Please try again in a moment. You can ask about your birth chart, Lal Kitab remedies, transits, or compatibility.';
}
