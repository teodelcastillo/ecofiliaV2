// publicTexts.js
require('dotenv').config({ path: '../.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Native fetch (Node 18+ — you're on Node 20 ✅)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PRIVATE_SERVICE_KEY
);

const SERVERLESS_ENDPOINT = 'https://ecofilia.vercel.app/api/extract-text-serverless';

async function main() {
  console.log("🔍 Fetching public documents...");

  const { data: documents, error } = await supabase
    .from('public_documents')
    .select('*')
    .is('extracted_text', null); 

  if (error) {
    console.error("❌ Error fetching documents:", error);
    return;
  }

  if (!documents.length) {
    console.log("✅ No documents to process.");
    return;
  }

  console.log(`📦 ${documents.length} documents to process...`);

  for (const doc of documents) {
    console.log(`➡️ Processing "${doc.name}" (ID: ${doc.id})`);

    try {
      const res = await fetch(SERVERLESS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: doc.id,
          type: 'public',
        }),
      });

      const result = await res.json();

      if (res.ok) {
        console.log(`✅ Extracted text for "${doc.name}"`);
      } else {
        console.warn(`⚠️ Failed: ${result.error}`);
      }
    } catch (err) {
      console.error(`❌ Error with ${doc.name}:`, err.message);
    }
  }

  console.log("✅ Finished processing all documents.");
}

main();
