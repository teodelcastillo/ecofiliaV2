import pdf from 'pdf-parse';

// You can expand this later for DOCX or other formats!
export const extractTextFromPDF = async (file: Blob | Buffer) => {
  const data = await pdf(file);
  return data.text;
};
