/**
 * واجهة EmbeddingProvider — قابلة للتبديل بين مزودين مختلفين
 * البعد: 1024 | النموذج: متعدد اللغات يدعم العربية
 */
export interface EmbeddingProvider {
  embed(text: string): Promise<number[]>;
  dimension: number;
}

/**
 * مزود embeddings افتراضي يستخدم Xenova/multilingual-e5-large
 * يعمل على الخادم فقط — لا يُستخدم في المتصفح
 */
export class XenovaEmbeddingProvider implements EmbeddingProvider {
  readonly dimension = 1024;
  private pipeline: any = null;

  async embed(text: string): Promise<number[]> {
    if (!this.pipeline) {
      // Dynamic import to avoid bundling in client
      const { pipeline } = await import('@xenova/transformers');
      this.pipeline = await pipeline(
        'feature-extraction',
        'Xenova/multilingual-e5-large',
        { quantized: true }
      );
    }
    const output = await this.pipeline(
      `query: ${text}`,
      { pooling: 'mean', normalize: true }
    );
    return Array.from(output.data as Float32Array);
  }
}

// Singleton instance
let _provider: EmbeddingProvider | null = null;

export function getEmbeddingProvider(): EmbeddingProvider {
  if (!_provider) {
    _provider = new XenovaEmbeddingProvider();
  }
  return _provider;
}
