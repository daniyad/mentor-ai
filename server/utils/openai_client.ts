import { LLMClient, Conversation, AiResponse } from "../types/conversation";
import OpenAI from "openai";

const openai = new OpenAI();
const openaiModel = "gpt-4-0125-preview";

export class OpenAIClient implements LLMClient {
    async createChatCompletion(conversation: Conversation): Promise<AiResponse | null> {
       const messages = conversation.messages.map((message) => ({
        role: message.role,
        content: message.text,
       })); 

       const response = await openai.chat.completions.create({
        model: openaiModel,
        messages: messages,
       });
       const responseText = response.choices[0].message.content;

       return {
        message: responseText,
        code_body: null
       }
    }
}