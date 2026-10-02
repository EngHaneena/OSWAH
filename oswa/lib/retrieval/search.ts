import { createServiceClient } from '@/lib/supabase/server';
import { getEmbeddingProvider } from '@/lib/embeddings/provider';

export interface SituationResult {
  id: string;
  title: string;
  story_summary: string | null;
  source_text_ar: string | null;
  source_book: string | null;
  source_ref: string | null;
  narrator: string | null;
  grade: string | null;
  source_url: string | null;
  problem_tags: string[] | null;
  emotions: string[] | null;
  lesson: string | null;
  prophetic_method: string | null;
  related_verse: string | null;
  sensitivity_level: string | null;
  age_suitability: string | null;
  kid_version: string | null;
  kid_question: string | null;
  status: string;
  similarity: number;
}

export async function searchSituations(
  query: string,
  matchCount = 3
): Promise<SituationResult[]> {
  const embeddingProvider = getEmbeddingProvider();
  const queryEmbedding = await embeddingProvider.embed(query);

  const allowDemo = process.env.ALLOW_DEMO === 'true';
  const supabase = await createServiceClient();

  const { data, error } = await supabase.rpc('match_situations', {
    query_embedding: queryEmbedding,
    match_count: matchCount,
    allow_demo: allowDemo,
  });

  if (error) {
    console.error('Search error:', error);
    throw new Error('فشل البحث في قاعدة البيانات');
  }

  return (data as SituationResult[]) || [];
}
