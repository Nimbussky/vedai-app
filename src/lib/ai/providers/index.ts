import type { LLMProvider } from './types';

// All available providers — import and register here
import { glmProvider } from './glm';
import { cerebrasProvider } from './cerebras';
import { geminiProvider } from './gemini';
import { mistralProvider } from './mistral';
import { groqProvider } from './groq';
import { openRouterProvider } from './openrouter';
import { deepSeekProvider } from './deepseek';
import { ollamaProvider } from './ollama';
import {
  zenMuxProvider,
  kimiProvider,
  qwenProvider,
  tokenRouterDeepSeekProvider,
  miniMaxProvider,
  claudeProvider,
  gptProvider,
  huggingFaceProvider,
} from './free-routes';

// Master registry — order = default priority
// Add new providers here, that's it!
export const ALL_PROVIDERS: LLMProvider[] = [
  groqProvider,
  glmProvider,
  cerebrasProvider,
  deepSeekProvider,
  geminiProvider,
  mistralProvider,
  openRouterProvider,
  zenMuxProvider,
  kimiProvider,
  qwenProvider,
  tokenRouterDeepSeekProvider,
  miniMaxProvider,
  claudeProvider,
  gptProvider,
  huggingFaceProvider,
  ollamaProvider,
];

// Get providers that have valid API keys, sorted by priority
export function getActiveProviders(): LLMProvider[] {
  return ALL_PROVIDERS
    .filter((p) => {
      // Ollama is always available (local)
      if (p.slug === 'ollama') return true;
      return !!p.getApiKey();
    })
    .sort((a, b) => a.priority - b.priority);
}

// Get a specific provider by slug
export function getProvider(slug: string): LLMProvider | undefined {
  return ALL_PROVIDERS.find((p) => p.slug === slug);
}

// List all registered providers with their status (for admin panel)
export function getProviderStatus() {
  return ALL_PROVIDERS.map((p) => ({
    name: p.name,
    slug: p.slug,
    model: p.model,
    priority: p.priority,
    hasKey: p.slug === 'ollama' ? true : !!p.getApiKey(),
    available: p.slug === 'ollama' ? true : !!p.getApiKey(),
  }));
}
