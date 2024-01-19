// server/llm/openAiClient.ts

import { LLMClient } from './llmClient';
import { Conversation } from './conversation';
import OpenAI from "openai";
import { ChatCompletionMessageParam, ChatCompletionSystemMessageParam, ChatCompletionUserMessageParam } from 'openai/resources';

const openai = new OpenAI();

class OpenAiClient implements LLMClient {
    async createChatCompletion(prompt: string, conversation: Conversation): Promise<string | null> {
        const messages: ChatCompletionMessageParam[]  = [{
            role: 'system',
            content: 'Starting a new conversation with the assistant.',
        }];
    
        
        
        for (const message of conversation.getHistory()) {
            messages.push({
                role: message.speaker === 'user' ? 'user' : 'system',
                content: message.text,
            });
        }
    
        messages.push({
            role: 'user',
            content: prompt,
        });
    
        const completion = await openai.chat.completions.create({
            messages: messages,
            model: "gpt-4-1106-preview",
        });
    
        return completion.choices[0].message.content;
    }
}

export { OpenAiClient };