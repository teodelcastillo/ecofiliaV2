// lib/docx.ts
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx"

export async function generateDocxFromText(text: string): Promise<Uint8Array> {
  const lines = text.split("\n").filter(line => line.trim() !== "")
  const paragraphs: Paragraph[] = []

  for (const line of lines) {
    if (line.startsWith("# ")) {
      paragraphs.push(new Paragraph({
        text: line.replace("# ", "").trim(),
        heading: HeadingLevel.HEADING_1,
      }))
    } else if (line.startsWith("## ")) {
      paragraphs.push(new Paragraph({
        text: line.replace("## ", "").trim(),
        heading: HeadingLevel.HEADING_2,
      }))
    } else if (line.startsWith("### ")) {
      paragraphs.push(new Paragraph({
        text: line.replace("### ", "").trim(),
        heading: HeadingLevel.HEADING_3,
      }))
    } else if (line.startsWith("**") && line.endsWith("**")) {
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: line.replace(/\*\*/g, "").trim(), bold: true })],
      }))
    } else {
      paragraphs.push(new Paragraph({
        children: [new TextRun(line.trim())],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
      }))
    }
  }

  const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] })
  return await Packer.toBuffer(doc)
}
