const { createClient } = require('@supabase/supabase-js');
const pdf = require('pdf-parse');

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
      return res.status(400).json({ error: 'Missing documentId or type' });
    }

    console.log(`Received documentId: ${documentId}`);
    console.log(`Document type: ${type}`);

    // Decide table and bucket
    let tableName = '';
    let bucketName = '';

    if (type === 'public') {
      tableName = 'public_documents';
      bucketName = 'documents';
    } else if (type === 'user') {
      tableName = 'documents';
      bucketName = 'user-documents';
    } else {
      return res.status(400).json({ error: 'Invalid document type' });
    }

    // Fetch document metadata
    console.log(`Fetching from table: ${tableName}`);
    const { data: doc, error: docError } = await supabase
      .from(tableName)
      .select('file_path')
      .eq('id', documentId)
      .single();

    if (docError || !doc) {
      console.error('Error fetching document:', docError);
      return res.status(404).json({ error: 'Document not found' });
    }

    const filePath = doc.file_path;
    if (!filePath) {
      console.error('Missing file path in document');
      return res.status(500).json({ error: 'Missing file path in document' });
    }

    console.log('File path:', filePath);

    // Download file from storage (private bucket)
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(bucketName)
      .download(filePath);

    if (downloadError || !fileData) {
      console.error('Error downloading file:', downloadError);
      return res.status(500).json({ error: 'Failed to download file' });
    }

    console.log('Successfully downloaded PDF');

    // Extract text
    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parsed = await pdf(buffer);
    console.log('Extracted text length:', parsed.text.length);

    // Update extracted_text column
    const { error: updateError } = await supabase
      .from(tableName)
      .update({ extracted_text: parsed.text })
      .eq('id', documentId);

    if (updateError) {
      console.error('Error updating document:', updateError);
      return res.status(500).json({ error: 'Failed to store extracted text' });
    }

    console.log('Successfully stored extracted text.');

    // Return success
    return res.status(200).json({ success: true, extractedText: parsed.text });

  } catch (err) {
    console.error('Error in serverless function:', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
};
