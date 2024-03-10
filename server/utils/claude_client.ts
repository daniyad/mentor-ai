import { LLMClient, Conversation, AiResponse } from '../types/conversation';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const claudeModel = 'claude-3-opus-20240229';

export class ClaudeClient implements LLMClient {
    async createChatCompletion(conversation: Conversation): Promise<AiResponse | null> {
        const messages = conversation.messages.map(message => ({
            role: message.role,
            content: message.text,
        }));

        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role === 'user') {
            lastMessage.content = `
                ${lastMessage.content} 
                My code is the following: ${conversation.code_body} 
                Please return a message of the following JSON form: { message: string, code_body: string }
            `;
        }
        messages[messages.length - 1] = lastMessage;

        const response = await anthropic.messages.create({
            model: claudeModel,
            messages: messages,
            max_tokens: 4000,
        });
        const json = JSON.parse(response.content[0].text);

        return {
            message: json["message"],
            code_body: json["code_body"]
        }
    }
}