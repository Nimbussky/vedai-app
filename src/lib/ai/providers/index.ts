import type { LLMProvider } from './types';

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

/**
 * OmniRouter Engine 2 registry
 * Priority = try order (lower first)
 * OpenRouter free cascade sits early so token limits rotate across many free models.
 */
export const ALL_PROVIDERS: LLMProvider[] = [
  groqProvider,           // 1 fast free
  glmProvider,            // 2 generous free
  cerebrasProvider,       // 3 fast free
  openRouterProvider,     // 4 free multi-model router (never alone)
  deepSeekProvider,       // 5
  geminiProvider,         // 6
  mistralProvider,        // 7
  zenMuxProvider,         // 8+
  kimiProvider,
  qwenProvider,
  tokenRouterDeepSeekProvider,
  miniMaxProvider,
  claudeProvider,
  gptProvider,
  huggingFaceProvider,
  ollamaProvider,         // local last
];

export function getActiveProviders(): LLMProvider[] {
  return ALL_PROVIDERS
    .filter((p) => {
      if (p.slug === 'ollama') return true;
      return !!p.getApiKey();
    })
    .sort((a, b) => a.priority - b.priority);
}

export function getProvider(slug: string): LLMProvider | undefined {
  return ALL_PROVIDERS.find((p) => p.slug === slug);
}

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
