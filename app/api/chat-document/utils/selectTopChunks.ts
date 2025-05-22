export function selectTopChunks(matches: any[], tokenLimit: number, maxChunkTokens: number = 3000) {
  const selectedChunks = []
  let totalTokens = 0
  let cumulativeScore = 0

  for (const chunk of matches) {
    const content = chunk.content || ''
    const tokens = Math.ceil(content.length / 4)

    if (tokens > maxChunkTokens) continue
    if (totalTokens + tokens > tokenLimit) break

    selectedChunks.push(chunk)
    totalTokens += tokens
    cumulativeScore += chunk.relevance_score ?? 0

    if (cumulativeScore > 5.0) break
  }

  return selectedChunks
}
