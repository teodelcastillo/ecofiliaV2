// lib/chunking.ts

import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const ChunkSchema = z.object({
  section_title: z.string(),
  content: z.string(),
  summary: z.string(),
  keywords: z.array(z.string()),
  section_level: z.number(),
  start_char: z.number(),
  end_char: z.number(),
});

export const ChunkListSchema = z.array(ChunkSchema);

export interface StructuredChunk extends z.infer<typeof ChunkSchema> {
  chunk_index: number;
  tokens: number;
  page_number: number | null;
}

export function splitTextIntoChunks(text: string, maxLength = 12000): string[] {
  const chunks = [];
  for (let i = 0; i < text.length; i += maxLength) {
    chunks.push(text.slice(i, i + maxLength));
  }
  return chunks;
}

export async function chunkWithOpenAI(text: string, offset = 0): Promise<StructuredChunk[]> {
  const rawChunks = splitTextIntoChunks(text);
  const results: StructuredChunk[] = [];

  for (const chunk of rawChunks) {
    const prompt = `Analiza el siguiente texto y devuélvelo como una lista de objetos JSON. Cada objeto debe tener:
- section_title
- content
- summary
- keywords
- section_level
- start_char
- end_char

Formato: JSON estricto en una lista []. No incluyas explicaciones, solo JSON.

Texto:
${chunk}`;

    const res = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "Devuelve únicamente un JSON plano válido, bien formateado y estrictamente compatible con JSON.parse. Nada de markdown, comentarios ni comillas inteligentes.",
        },
        { role: "user", content: prompt },
      ],
    });

    const raw = res.choices[0].message.content || "[]";
    const jsonMatch = raw.match(/\[.*\]/s);

    if (!jsonMatch) {
      console.warn("⚠️ No se encontró JSON válido en la respuesta:", raw);
      continue;
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]);
      const validated = ChunkListSchema.parse(parsed);
      validated.forEach((chunk, i) => {
        results.push({
          ...chunk,
          chunk_index: results.length + i,
          tokens: Math.ceil(chunk.content.length / 4),
          page_number: null,
          start_char: chunk.start_char + offset,
          end_char: chunk.end_char + offset,
        });
      });
    } catch (err) {
      console.warn("❌ JSON inválido o no matchea con el schema:", err);
    }
  }

  return results;
}