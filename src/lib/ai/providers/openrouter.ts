import type { LLMProvider } from './types';

// ============================================
// OPENROUTER — OmniRouter-style free cascade
// Uses OpenRouter Free Models Router + explicit free fallback list
// so one key unlocks many models and rate-limits don't kill chat.
// Docs: openrouter/free + models[] failover
// ============================================

/** Priority free models — tried in order when primary fails */
export const OPENROUTER_FREE_MODELS = [
  'openrouter/free', // auto-picks any available free model
  'meta-llama/llama-3.3-70b-instruct:free',
  'google/gemini-2.0-flash-exp:free',
  'qwen/qwen3-coder:free',
  'deepseek/deepseek-r1:free',
  'nvidia/llama-3.1-nemotron-70b-instruct:free',
] as const;

export const openRouterProvider: LLMProvider = {
  name: 'OpenRouter Free',
  slug: 'openrouter',
  url: 'https://openrouter.ai/api/v1/chat/completions',
  getApiKey: () => process.env.OPENROUTER_API_KEY,
  model: 'openrouter/free',
  priority: 4,
  supportsStreaming: true,
  buildHeaders: (key) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${key}`,
    'HTTP-Referer': 'https://vedai.app',
    'X-Title': 'VedAI-OmniRouter',
  }),
  buildBody: (msg, sys) => JSON.stringify({
    // Primary: free models router; models[] = auto-failover chain
    model: 'openrouter/free',
    models: [...OPENROUTER_FREE_MODELS],
    messages: [
      { role: 'system', content: sys },
      { role: 'user', content: msg },
    ],
    temperature: 0.7,
    stream: true,
    max_tokens: 4096,
  }),
  parseStreamChunk: (line) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith('data: ')) return null;
    const data = trimmed.slice(6);
    if (data === '[DONE]') return '__DONE__';
    try {
      const parsed = JSON.parse(data);
      return parsed.choices?.[0]?.delta?.content || null;
    } catch {
      return null;
    }
  },
};
