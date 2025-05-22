// utils/detectStructuredQuestion.ts
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export type QuestionIntent =
  | 'summary_each'
  | 'compare_documents'
  | 'extract_measures'
  | 'identify_actors'
  | 'extract_indicators'
  | 'common_themes'
  | 'general'

export interface QuestionAnalysis {
  intent: QuestionIntent
  instruction: string
}

const INSTRUCTIONS_MAP: Record<QuestionIntent, string> = {
  summary_each: 'Resumí cada documento por separado y luego identificá puntos en común entre ellos.',
  compare_documents: 'Compará los enfoques, compromisos o resultados entre los documentos seleccionados.',
  extract_measures: 'Extraé las principales medidas o estrategias que se mencionan en los documentos.',
  identify_actors: 'Identificá los actores clave o responsables mencionados en cada documento.',
  extract_indicators: 'Listá los indicadores, metas numéricas o datos cuantitativos presentes.',
  common_themes: 'Identificá temas transversales o elementos en común entre los documentos.',
  general: '', // sin instrucción adicional
}

export async function detectStructuredQuestion(userQuestion: string): Promise<QuestionAnalysis> {
  const prompt = `
Estás analizando la intención de una pregunta hecha por un usuario de una plataforma de análisis de documentos sobre sostenibilidad y cambio climático.

Clasificá la pregunta en uno de estos tipos:

- "summary_each": quiere un resumen por documento
- "compare_documents": quiere una comparación entre documentos
- "extract_measures": busca medidas o estrategias mencionadas
- "identify_actors": quiere saber quiénes implementan o son responsables
- "extract_indicators": quiere cifras, metas o indicadores
- "common_themes": busca puntos en común entre documentos
- "general": no encaja claramente en ninguna de las anteriores

Ejemplo de pregunta: "${userQuestion}"
Respuesta: `.trim()

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0,
    max_tokens: 20,
  })

  const rawIntent = completion.choices[0]?.message?.content?.trim().toLowerCase() as QuestionIntent

  const intent: QuestionIntent = [
    'summary_each',
    'compare_documents',
    'extract_measures',
    'identify_actors',
    'extract_indicators',
    'common_themes',
  ].includes(rawIntent as QuestionIntent)
    ? rawIntent as QuestionIntent
    : 'general'

  return {
    intent,
    instruction: INSTRUCTIONS_MAP[intent],
  }
}
