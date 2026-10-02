import Anthropic from '@anthropic-ai/sdk';

let _client: Anthropic | null = null;

export function getLLMClient(): Anthropic {
  if (!_client) {
    _client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });
  }
  return _client;
}

export function getModel(): string {
  const model = process.env.LLM_MODEL;
  if (!model) throw new Error('متغير البيئة LLM_MODEL غير محدد');
  return model;
}
