import pdf from 'pdf-parse';

export const extractTextFromPDF = async (file: Blob | Buffer) => {
  let buffer: Buffer;

  if (file instanceof Blob) {
    buffer = Buffer.from(await file.arrayBuffer());
  } else if (Buffer.isBuffer(file)) {
    buffer = Buffer.from(file); // 🔁 recreate safely
  } else {
    throw new Error("Invalid file type. Must be Blob or Buffer.");
  }

  const data = await pdf(buffer);
  return data.text;
};
