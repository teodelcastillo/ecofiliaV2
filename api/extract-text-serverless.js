const { createClient } = require('@supabase/supabase-js');
const pdf = require('pdf-parse');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PRIVATE_SERVICE_KEY
);

module.exports = async (req, res) => {
  console.log('Received request at serverless function');
  console.log("🔥 extract-text-serverless TRIGGERED");
  console.log("Referer:", req.headers.referer);


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
    .select(type === 'public' ? 'file_url' : 'file_path')
    .eq('id', documentId)
    .single();
  

    if (docError || !doc) {
      console.error('Error fetching document:', docError);
      return res.status(404).json({ error: 'Document not found' });
    }

    let filePath;
    if (type === 'public') {
      const publicUrl = doc.file_url;
      if (!publicUrl) {
        console.error('Missing file_url in public document');
        return res.status(500).json({ error: 'Missing file_url in document' });
      }
      // Extract the file path from the public URL
      const parts = publicUrl.split('/documents/');
      filePath = parts[1];
      if (!filePath) {
        console.error('Could not parse file path from file_url');
        return res.status(500).json({ error: 'Invalid file_url format' });
      }
    } else {
      filePath = doc.file_path;
      if (!filePath) {
        console.error('Missing file_path in private document');
        return res.status(500).json({ error: 'Missing file_path in document' });
      }
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
