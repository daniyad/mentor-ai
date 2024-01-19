// server/llm/llmClient.ts

import { Conversation } from "./conversation";


interface LLMClient {
  createChatCompletion(prompt: string, conversation: Conversation): Promise<string | null>;
}
  
export { LLMClient };