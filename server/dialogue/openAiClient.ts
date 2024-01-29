// server/llm/openAiClient.ts

import { LLMClient } from './llmClient';
import { Conversation } from './conversation';
import OpenAI from "openai";
import { ChatCompletionMessageParam, ChatCompletionSystemMessageParam, ChatCompletionUserMessageParam } from 'openai/resources';
import { AiResponse, EvaluationResponse } from './dialogue';

const openai = new OpenAI();

class OpenAiClient implements LLMClient {
    async createChatCompletion(prompt: string, conversation: Conversation): Promise<AiResponse | null> {
        const messages: ChatCompletionMessageParam[]  = [{
            role: 'system',
            content: `
                You are an assistant that helps your user learn how to code. Every message the user sends you will be JSON composed of two
                fields: text and code. Text is the text the user has sent you and code is the current code that the user has written to solve
                the problem that they're working on.
            `
        }];
    
        
        
        for (const message of conversation.getHistory()) {
            let jsonified_message_object: any = {}
            jsonified_message_object['code'] = message.code
            jsonified_message_object['text'] = message.text
            messages.push({
                role: message.speaker === 'user' ? 'user' : 'system',
                content: JSON.stringify(jsonified_message_object),
            });
        }
    
        messages.push({
            role: 'user',
            content: prompt,
        });
    
        const completion = await openai.chat.completions.create({
            messages: messages,
            model: "gpt-4-turbo-preview",
            response_format: {
                type: "json_object",
            }
        });

        let returned_json;
        if (completion.choices[0].message.content !== null) {
            returned_json = JSON.parse(completion.choices[0].message.content);

            let ai_response_object: AiResponse = {}
            
            if ('code' in returned_json && typeof returned_json.code === 'string'){
                ai_response_object['code'] = returned_json['code'];
            }

            if('text' in returned_json && typeof returned_json.text === 'string'){
                ai_response_object['text'] = returned_json['text'];
            }
            return ai_response_object
        } else {
            return {}
        }
    }
}

export { OpenAiClient };