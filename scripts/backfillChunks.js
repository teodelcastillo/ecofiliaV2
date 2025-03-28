require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { OpenAIEmbeddings } = require('@langchain/openai');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PRIVATE_SERVICE_KEY
);

const embedder = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

async function backfillTable(table, type) {
  console.log(`📄 Backfilling ${table} (${type})`);

  const { data: docs, error } = await supabase
    .from(table)
    .select('id, extracted_text')
    .not('extracted_text', 'is', null);

  if (error) {
    console.error(`❌ Error fetching ${table}:`, error);
    return;
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  for (const doc of docs) {
    const text = doc.extracted_text?.trim();
    if (!text) continue;

    try {
      const chunks = await splitter.createDocuments([text]);
      const texts = chunks.map((c) => c.pageContent);
      const embeddings = await embedder.embedDocuments(texts);

      const chunksToInsert = embeddings.map((embedding, i) => ({
        document_id: doc.id,
        document_type: type,
        content: texts[i],
        embedding,
      }));

      const { error: insertError } = await supabase
        .from('document_chunks')
        .insert(chunksToInsert);

      if (insertError) {
        console.error(`❌ Failed to insert chunks for ${doc.id}`, insertError);
      } else {
        console.log(`✅ Inserted ${chunksToInsert.length} chunks for ${doc.id}`);
      }
    } catch (err) {
      console.error(`🔥 Failed on document ${doc.id}:`, err);
    }
  }
}

async function main() {
  await backfillTable('documents', 'user');
  await backfillTable('public_documents', 'public');
  console.log('🎉 Backfill complete');
}

main();
