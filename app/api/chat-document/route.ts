import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { OpenAIEmbeddings } from '@langchain/openai';

// --- Configuración ---
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const embedder = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY! });
const MAX_TOKENS_BUDGET = 40000; // Presupuesto total de tokens

// --- Utilidades ---
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PRIVATE_SERVICE_KEY!);
}

// --- Helper para formatear cada chunk ---
function formatChunk(match: any): string {
  const parts = [];

  if (match.title) {
    parts.push(`**${match.title.trim()}**`);
  }

  if (match.summary) {
    parts.push(`_${match.summary.trim()}_`);
  }

  if (Array.isArray(match.keywords) && match.keywords.length > 0) {
    parts.push(`**Keywords:** ${match.keywords.join(', ')}`);
  }

  if (match.content) {
    const quotedContent = match.content
      .trim()
      .split('\n')
      .filter((line: string) => line.trim() !== '')
      .map((line: any) => `> ${line}`)
      .join('\n');
    parts.push(quotedContent);
  }

  if (parts.length === 0) {
    parts.push(`_(No relevant content found in this section)_`);
  }

  return parts.join('\n\n');
}

// --- API Handler ---
export async function POST(req: NextRequest) {
  const start = performance.now();

  try {
    // 1. Parsear y validar input
    const { documents, question, userId } = await req.json();
    if (!question?.trim() || !userId || !Array.isArray(documents)) {
      console.warn('⚠️ Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = getSupabase();
    const publicIds = documents.map(d => d.id);

    console.log('📄 Public document IDs:', publicIds);

    // 2. Embedding de la pregunta
    const questionEmbedding = await embedder.embedQuery(question);
    console.log('🔍 Question embedded.');

    // 3. Traer metadata de documentos para armar nombres amigables
    const { data: publicMeta, error: publicMetaError } = await supabase
      .from('public_documents')
      .select('id, name')
      .in('id', publicIds);

    if (publicMetaError) {
      console.error('❌ Error fetching document metadata:', publicMetaError);
      return NextResponse.json({ error: 'Error fetching document metadata' }, { status: 500 });
    }

    const titleMap: Record<string, string> = Object.fromEntries(
      (publicMeta || []).map((doc: any) => [doc.id, doc.name])
    );

    // 4. Obtener los mejores chunks por documento
    const perDocumentChunks: any[] = [];
    const documentsMissing: string[] = [];

    for (const docId of publicIds) {
      const { data: matches, error } = await supabase.rpc('match_smart_chunks', {
        query_embedding: questionEmbedding,
        match_count: 5,
        filter_document_ids: [docId],
      });

      if (error) {
        console.warn(`⚠️ Error fetching matches for document ${docId}:`, error.message);
        documentsMissing.push(docId);
        continue;
      }

      if (!matches || matches.length === 0) {
        // Si no hay matches, intentar obtener el primer chunk del documento
        const { data: fallbackChunk, error: fallbackError } = await supabase
          .from('smart_chunks')
          .select('*')
          .eq('public_document_id', docId)
          .order('chunk_index', { ascending: true })
          .limit(1)
          .single();

        if (fallbackError || !fallbackChunk) {
          console.warn(`⚠️ No fallback chunk found for document ${docId}`);
          documentsMissing.push(docId);
          continue;
        }

        perDocumentChunks.push({ docId, chunks: [fallbackChunk] });
      } else {
        perDocumentChunks.push({ docId, chunks: matches });
      }
    }

    // 5. Construir contexto para OpenAI
    const documentSections: string[] = [];
    let totalTokens = 0;

    // --- (1) Agregar chunks por documento ---
    for (const { docId, chunks } of perDocumentChunks) {
      const title = titleMap[docId] || `Document ${docId}`;
      const topChunks = chunks.slice(0, 3); // Al menos 3 chunks por documento

      for (const match of topChunks) {
        const chunkText = formatChunk(match);
        const chunkTokens = estimateTokens(chunkText);

        if (totalTokens + chunkTokens > MAX_TOKENS_BUDGET) {
          console.warn(`⚠️ Token budget exceeded while adding chunks for document ${docId}`);
          break;
        }

        const section = `### 📘 ${title}\n\n${chunkText}`;
        documentSections.push(section);
        totalTokens += chunkTokens;
      }
    }

    // --- (2) Agregar chunks adicionales globales si queda espacio ---
    const { data: globalMatches, error: globalMatchError } = await supabase.rpc('match_smart_chunks', {
      query_embedding: questionEmbedding,
      match_count: 100,
      filter_document_ids: publicIds,
    });

    if (globalMatchError) {
      console.error('❌ Error fetching global matches:', globalMatchError);
      return NextResponse.json({ error: 'Error fetching global matches' }, { status: 500 });
    }

    const usedChunkIds = new Set(
      perDocumentChunks.flatMap(({ chunks }) => chunks.map((chunk: any) => chunk.id))
    );

    const additionalChunks = (globalMatches || [])
      .filter((match: any) => !usedChunkIds.has(match.id))
      .sort((a: any, b: any) => (b.similarity_score ?? 0) - (a.similarity_score ?? 0));

    for (const match of additionalChunks) {
      const chunkText = formatChunk(match);
      const chunkTokens = estimateTokens(chunkText);

      if (totalTokens + chunkTokens > MAX_TOKENS_BUDGET) {
        console.log(`⚠️ Token budget reached after adding additional chunks.`);
        break;
      }

      const title = titleMap[match.public_document_id] || `Document ${match.public_document_id}`;
      const section = `### 📘 ${title}\n\n${chunkText}`;
      documentSections.push(section);
      totalTokens += chunkTokens;
    }

    // --- Construir el resumen dinámico ---
    const documentsIncluded = perDocumentChunks.map(({ docId }) => docId);

    const documentsCovered = documentsIncluded
      .map(id => titleMap[id] ? `✅ ${titleMap[id]}` : `✅ Document ${id}`)
      .join('\n');

    const documentsOmitted = documentsMissing.length > 0
      ? documentsMissing
          .map(id => titleMap[id] ? `⚠️ ${titleMap[id]}` : `⚠️ Document ${id}`)
          .join('\n')
      : '';

    const summaryBlock = `
**Resumen:**
- Documentos incluidos:
${documentsCovered}
${documentsOmitted ? `\n- Documentos NO incluidos (no se encontraron fragmentos relevantes):\n${documentsOmitted}` : ''}
- Total de fragmentos utilizados: ${documentSections.length}
- Total de tokens consumidos: ${totalTokens} / ${MAX_TOKENS_BUDGET}
`.trim();

    // --- Crear prompts para OpenAI ---
    const systemPrompt = `
Eres Ecofilia, una experta en sostenibilidad, cambio climático y marcos ESG.

Asistes a los usuarios analizando múltiples documentos a la vez.

Al responder:
- Utiliza cuidadosamente las secciones de documentos proporcionadas.
- Siempre **cita claramente** en qué documento(s) se basa tu respuesta.
- Si el usuario pregunta por **cada documento por separado**, responde **documento por documento**, etiquetando claramente cada uno.
- Si el usuario hace una **pregunta general**, **sintetiza** ideas entre documentos.
- Si es relevante, **cita** frases clave o resúmenes de los documentos.
- Prefiere respuestas **detalladas** y **completas** sobre respuestas breves.

**Guías de formato (Markdown):**
- Usa \`###\` para encabezados principales (por ejemplo, por documento o por tema).
- Usa \`**negrita**\` para títulos de documentos, nombres de secciones y términos importantes.
- Usa \`> citas\` para resaltar fragmentos de texto relevantes de los documentos.
- Usa viñetas \`-\` para listas o respuestas de múltiples partes.
- Estructura tu respuesta en secciones claras para maximizar la legibilidad.

**Prioriza (en este orden):**
1. Precisión factual.
2. Claridad y estructura.
3. Integridad y riqueza de información.
4. Tono profesional y conciso.

Si no puedes encontrar una respuesta directa en los documentos, **indícalo claramente** y recomienda los próximos pasos si es posible.

Sé precisa, bien organizada y profesional, utilizando un lenguaje claro comprensible para audiencias no expertas.
`.trim();

    const userPrompt = documentSections.length > 0
      ? `
${summaryBlock}

A continuación se presentan fragmentos de los documentos seleccionados:

${documentSections.join('\n\n')}

Por favor, responde la siguiente pregunta basándote en la información anterior:

**Pregunta:** ${question}
      `.trim()
      : `
El usuario seleccionó documentos, pero no se encontraron fragmentos relevantes.

Por favor, intenta responder la siguiente pregunta si es posible:

**Pregunta:** ${question}
      `.trim();

    // --- Llamar a OpenAI ---
    // --- Llamar a OpenAI ---
    console.log('🧠 Llamando a OpenAI...');

    const openaiStream = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      stream: true,
      max_tokens: 16384,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    // --- Responder como Stream ---
    const encoder = new TextEncoder();
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    (async () => {
      for await (const chunk of openaiStream) {
        const content = chunk.choices?.[0]?.delta?.content;
        if (content) {
          await writer.write(encoder.encode(content));
        }
      }
      await writer.close();
    })();

    console.log(`✅ Response generated in ${(performance.now() - start).toFixed(1)}ms`);

    return new NextResponse(readable, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (err) {
    console.error('🔥 Unhandled error:', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
