import pdf from 'pdf-parse';

// You can expand this later for DOCX or other formats!
export const extractTextFromPDF = async (file: Blob | Buffer) => {
  const buffer = file instanceof Blob ? Buffer.from(await file.arrayBuffer()) : file;
  const data = await pdf(buffer);
  return data.text;
};
