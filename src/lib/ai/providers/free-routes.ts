import type { LLMProvider } from './types';

// ============================================
// EXTRA FREE BACKUP ROUTES (no new accounts needed)
// OpenAI-compatible chat completions + SSE streaming.
// ============================================

type FreeRouteConfig = {
  name: string;
  slug: string;
  url: string;
  keyEnv: string;
  model: string;
  priority: number;
};

function makeOpenAICompatRoute(cfg: FreeRouteConfig): LLMProvider {
  return {
    name: cfg.name,
    slug: cfg.slug,
    url: cfg.url,
    getApiKey: () => process.env[cfg.keyEnv],
    model: cfg.model,
    priority: cfg.priority,
    supportsStreaming: true,
    buildHeaders: (key) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    }),
    buildBody: (msg, sys) => JSON.stringify({
      model: cfg.model,
      messages: [
        { role: 'system', content: sys },
        { role: 'user', content: msg },
      ],
      temperature: 0.7,
      stream: true,
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
}

// ZenMux — free GLM on OpenAI-compatible gateway
export const zenMuxProvider: LLMProvider = makeOpenAICompatRoute({
  name: 'ZenMux GLM',
  slug: 'zenmux',
  url: 'https://zenmux.ai/api/v1/chat/completions',
  keyEnv: 'ZENMUX_API_KEY',
  model: 'z-ai/glm-4.6v-flash-free',
  priority: 6,
});

// TokenRouter — free tier of major models through one gateway
export const kimiProvider: LLMProvider = makeOpenAICompatRoute({
  name: 'Kimi K3',
  slug: 'kimi',
  url: 'https://api.tokenrouter.com/v1/chat/completions',
  keyEnv: 'TOKENROUTER_KIMI_KEY',
  model: 'moonshotai/kimi-k3-free',
  priority: 7,
});

export const qwenProvider: LLMProvider = makeOpenAICompatRoute({
  name: 'Qwen',
  slug: 'qwen',
  url: 'https://api.tokenrouter.com/v1/chat/completions',
  keyEnv: 'TOKENROUTER_QWEN_KEY',
  model: 'qwen/qwen3.7-max',
  priority: 8,
});

export const tokenRouterDeepSeekProvider: LLMProvider = makeOpenAICompatRoute({
  name: 'DeepSeek TR',
  slug: 'tokenrouter-deepseek',
  url: 'https://api.tokenrouter.com/v1/chat/completions',
  keyEnv: 'TOKENROUTER_DEEPSEEK_KEY',
  model: 'deepseek/deepseek-v4-pro',
  priority: 9,
});

export const miniMaxProvider: LLMProvider = makeOpenAICompatRoute({
  name: 'MiniMax',
  slug: 'minimax',
  url: 'https://api.tokenrouter.com/v1/chat/completions',
  keyEnv: 'TOKENROUTER_MINIMAX_KEY',
  model: 'MiniMax-M3',
  priority: 10,
});

export const claudeProvider: LLMProvider = makeOpenAICompatRoute({
  name: 'Claude Free',
  slug: 'claude',
  url: 'https://api.tokenrouter.com/v1/chat/completions',
  keyEnv: 'TOKENROUTER_CLAUDE_KEY',
  model: 'anthropic/claude-fable-5',
  priority: 11,
});

export const gptProvider: LLMProvider = makeOpenAICompatRoute({
  name: 'GPT Free',
  slug: 'gpt',
  url: 'https://api.tokenrouter.com/v1/chat/completions',
  keyEnv: 'TOKENROUTER_GPT_KEY',
  model: 'openai/gpt-5.6-luna',
  priority: 12,
});

// HuggingFace free inference
export const huggingFaceProvider: LLMProvider = {
  name: 'HuggingFace',
  slug: 'huggingface',
  url: 'https://router.huggingface.co/v1/chat/completions',
  getApiKey: () => process.env.HUGGINGFACE_API_KEY,
  model: 'meta-llama/Llama-3.3-70B-Instruct',
  priority: 13,
  supportsStreaming: true,
  buildHeaders: (key) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${key}`,
  }),
  buildBody: (msg, sys) => JSON.stringify({
    model: 'meta-llama/Llama-3.3-70B-Instruct',
    messages: [
      { role: 'system', content: sys },
      { role: 'user', content: msg },
    ],
    temperature: 0.7,
    stream: true,
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
