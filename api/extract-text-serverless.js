const { createClient } = require('@supabase/supabase-js');
const pdf = require('pdf-parse');

// 🔑 Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PRIVATE_SERVICE_KEY
);

module.exports = async (req, res) => {
  console.log('Received request at serverless function');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { documentId, type } = req.body;

    if (!documentId || !type) {
      console.error('Missing documentId or type');
      return res.status(400).json({ error: 'Missing documentId or type (public or user)' });
    }

    console.log(`Received documentId: ${documentId}`);
    console.log(`Document type: ${type}`);

    // Determine table and bucket dynamically
    let tableName = '';
    let bucketName = '';

    if (type === 'public') {
      tableName = 'public_documents';
      bucketName = 'documents';
    } else if (type === 'user') {
      tableName = 'documents';
      bucketName = 'user_documents';
    } else {
      return res.status(400).json({ error: 'Invalid type. Must be "public" or "user"' });
    }

    // Fetch document metadata
    console.log(`Fetching from table: ${tableName}`);
    const { data: doc, error: docError } = await supabase
      .from(tableName)
      .select('file_url')
      .eq('id', documentId)
      .single();

    if (docError || !doc) {
      console.error('Error fetching document:', docError);
      return res.status(404).json({ error: 'Document not found' });
    }
    console.log('Successfully fetched document metadata:', doc);

    // Extract file path from file_url
    const filePath = doc.file_url.split(`/${bucketName}/`)[1];
    if (!filePath) {
      console.error('Could not parse file path from file_url');
      return res.status(500).json({ error: 'Invalid file_url format' });
    }
    console.log('Parsed file path:', filePath);

    // Download PDF from Supabase Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(bucketName)
      .download(filePath);

    if (downloadError || !fileData) {
      console.error('Error downloading file:', downloadError);
      return res.status(500).json({ error: 'Failed to download file' });
    }
    console.log('Successfully downloaded file');

    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text using pdf-parse
    const parsed = await pdf(buffer);
    console.log('Extracted text length:', parsed.text.length);

    // Store extracted text back in the correct table
    const { error: updateError } = await supabase
      .from(tableName)
      .update({ extracted_text: parsed.text })
      .eq('id', documentId);

    if (updateError) {
      console.error('Error updating document with extracted text:', updateError);
      return res.status(500).json({ error: 'Failed to store extracted text' });
    }

    console.log('Successfully stored extracted text');
    return res.status(200).json({ success: true, extractedText: parsed.text });

  } catch (err) {
    console.error('Unhandled server error:', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
};
