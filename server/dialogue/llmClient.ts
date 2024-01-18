// server/llm/llmClient.ts

interface LLMClient {
  createCompletion(prompt: string, maxTokens: number): Promise<string>;
}
  
export { LLMClient };