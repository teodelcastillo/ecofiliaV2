import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import pdf from 'pdf-parse';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PRIVATE_SERVICE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Received request at serverless function');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { documentId } = req.body;
    if (!documentId) return res.status(400).json({ error: 'Missing documentId' });

    console.log(`Received documentId: ${documentId}`);

    // Fetch document metadata
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .select('file_url')
      .eq('id', documentId)
      .single();

    if (docError || !doc) return res.status(404).json({ error: 'Document not found' });

    console.log('Successfully fetched document metadata:', doc);

    const filePath = doc.file_url.split('/user_documents/')[1];
    console.log('File path:', filePath);

    const { data: fileData, error: downloadError } = await supabase.storage
      .from('user_documents')
      .download(filePath);

    if (downloadError || !fileData) return res.status(500).json({ error: 'Failed to download file' });

    console.log('Successfully downloaded PDF');

    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text using pdf-parse
    const parsed = await pdf(buffer);
    console.log('Extracted text length:', parsed.text.length);

    // Store extracted text back
    await supabase
      .from('documents')
      .update({ extracted_text: parsed.text })
      .eq('id', documentId);

    console.log('Successfully updated Supabase');

    return res.status(200).json({ success: true, extractedText: parsed.text });

  } catch (err) {
    console.error('Error in serverless function:', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
