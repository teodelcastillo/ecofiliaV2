    import { NextRequest, NextResponse } from 'next/server';
    import { createClient } from '@supabase/supabase-js';
    import OpenAI from 'openai';
    import { OpenAIEmbeddings } from '@langchain/openai';

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PRIVATE_SERVICE_KEY!
    );

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    const embedder = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });

    const MAX_TOKENS_BUDGET = 6000;

    function estimateTokens(text: string): number {
      return Math.ceil(text.length / 4); // Rough estimate
    }

    export async function POST(req: NextRequest) {

      try {
        const body = await req.json();

        const { documents, question, userId } = body;

        if (!documents?.length || !question?.trim() || !userId) {
          return NextResponse.json({ error: 'Missing question, documents, or userId' }, { status: 400 });
        }

        const documentIds = documents.map((doc: { id: string }) => doc.id);

        // 🔹 Fetch document titles for reference in prompt
        const { data: docMetadata, error: metaError } = await supabase
          .from('documents')
          .select('id, name')
          .in('id', documentIds);

        if (metaError || !docMetadata) {
          console.error('❌ Failed to fetch document titles:', metaError);
          return NextResponse.json({ error: 'Failed to fetch document titles' }, { status: 500 });
        }

        // 🔹 Build map: document_id => name
        const titleMap = Object.fromEntries(docMetadata.map(doc => [doc.id, doc.name]));

        // 🔹 Embed the question
        const questionEmbedding = await embedder.embedQuery(question);

        // 🔹 Vector match with filter
        const { data: matches, error } = await supabase.rpc('match_document_chunks', {
          query_embedding: questionEmbedding,
          match_count: 20,
          match_user_id: userId,
          filter_document_ids: documentIds,
        });

        if (error) {
          console.error('❌ match_document_chunks error:', error);
          return NextResponse.json({ error: 'Failed to match document chunks' }, { status: 500 });
        }

        if (!matches?.length) {
          return NextResponse.json({ error: 'No relevant content found in selected documents' }, { status: 400 });
        }


        // 🔹 Build token-aware context block
        let combinedText = '';
        let totalTokens = 0;

        for (const match of matches) {
          const chunkText = match.content?.trim();
          if (!chunkText) continue;

          const chunkTokens = estimateTokens(chunkText);
          if (totalTokens + chunkTokens > MAX_TOKENS_BUDGET) break;

          const title = titleMap[match.document_id] || `Document ${match.document_id}`;
          combinedText += `\n--- Document: ${title} (${match.document_type}) ---\n${chunkText}\n`;
          totalTokens += chunkTokens;
        }

        if (!combinedText.trim()) {
          return NextResponse.json({ error: 'No usable content from matched chunks' }, { status: 400 });
        }

        // 🔹 Prompt setup
        const systemPrompt = `
          You are an expert assistant in environmental issues. Your goal is to help the user understand the content of documents in a professional, clean, and organized way.

          Please follow this formatting style using Markdown:
          - Use **titles** and **subheadings** with \`###\` or \`####\`.
          - Use **bullet points** or **numbered lists** when listing items or sections.
          - Bold important keywords and section headers using \`**\`.
          - Add a blank line between paragraphs for clarity.
          - Avoid repeating the document title excessively.

          Always cite the document title at the top once like this:

          **Document: IDOM Emisiones GEI (user)**

          Then structure your explanation below using Markdown formatting.
          `;

    const userPrompt = `
    Answer the following question using only the provided excerpts:

    ${combinedText}

    Question: ${question}
    `;

        console.log(`🧠 Final prompt token estimate: ~${totalTokens} + question`);

        const openaiStream = await openai.chat.completions.create({
          model: 'gpt-4-turbo',
          stream: true,
          max_tokens: 4096,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        });

        const encoder = new TextEncoder();

        const stream = new ReadableStream({
          async start(controller) {
            for await (const chunk of openaiStream) {
              const content = chunk.choices?.[0]?.delta?.content;
              if (content) {
                controller.enqueue(encoder.encode(content));
              }
            }
            controller.close();
          },
        });

        return new NextResponse(stream, {
          status: 200,
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
          },
        });
      } catch (err) {
        console.error('🔥 Unhandled server error:', err);
        return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
      }
    }
