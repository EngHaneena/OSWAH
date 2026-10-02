import { createClient } from '@supabase/supabase-js';
import * as xlsx from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Service Role Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: ts-node scripts/import-excel.ts <path-to-excel-file>');
    process.exit(1);
  }

  const absolutePath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`File not found: ${absolutePath}`);
    process.exit(1);
  }

  console.log(`Reading Excel file: ${absolutePath}`);
  const workbook = xlsx.readFile(absolutePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Assuming the first row is the header
  const rows = xlsx.utils.sheet_to_json<any>(sheet);
  console.log(`Found ${rows.length} rows. Starting import...`);

  // Dynamically import Xenova embeddings to generate vector embeddings for each row
  console.log('Loading Xenova embeddings model...');
  const { pipeline } = await import('@xenova/transformers');
  const embedder = await pipeline('feature-extraction', 'Xenova/multilingual-e5-large', { quantized: true });

  let successCount = 0;
  let errorCount = 0;

  for (const [index, row] of rows.entries()) {
    try {
      // Create a search text string to embed
      const searchText = [
        row.title || '',
        row.story_summary || '',
        row.lesson || '',
        row.problem_tags ? row.problem_tags.split(',').join(' ') : ''
      ].join(' ');

      const output = await embedder(`query: ${searchText}`, { pooling: 'mean', normalize: true });
      const embedding = Array.from(output.data as Float32Array);

      // Map Excel columns to DB schema
      const record = {
        id: row.id || `ext-${Date.now()}-${index}`,
        title: row.title,
        story_summary: row.story_summary,
        source_text_ar: row.source_text_ar,
        source_book: row.source_book,
        source_ref: String(row.source_ref || ''),
        narrator: row.narrator,
        grade: row.grade,
        source_url: row.source_url,
        problem_tags: row.problem_tags ? row.problem_tags.split(',').map((s: string) => s.trim()) : [],
        emotions: row.emotions ? row.emotions.split(',').map((s: string) => s.trim()) : [],
        lesson: row.lesson,
        prophetic_method: row.prophetic_method,
        related_verse: row.related_verse,
        sensitivity_level: row.sensitivity_level || 'أ',
        age_suitability: row.age_suitability || 'عام',
        kid_version: row.kid_version,
        kid_question: row.kid_question,
        status: row.status || 'pending',
        search_text: searchText,
        embedding: embedding,
      };

      const { error } = await supabase.from('situations').upsert(record);
      if (error) {
        console.error(`Error row ${index + 2}:`, error.message);
        errorCount++;
      } else {
        successCount++;
      }
    } catch (err: any) {
      console.error(`Error processing row ${index + 2}:`, err.message);
      errorCount++;
    }
  }

  console.log(`\nImport complete.`);
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
}

main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
