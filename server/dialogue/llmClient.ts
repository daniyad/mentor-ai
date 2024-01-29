// server/llm/llmClient.ts
import { Conversation } from "./conversation";
import { AiResponse, EvaluationResponse } from "./dialogue";


interface LLMClient {
  createChatCompletion(prompt: string, conversation: Conversation): Promise< AiResponse | null>;
}
  
export { LLMClient };