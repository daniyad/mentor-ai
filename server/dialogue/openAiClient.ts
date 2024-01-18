// server/llm/openAiClient.ts

import { LLMClient } from './llmClient';
import { openai } from '../openai'; // Assume this is a configured OpenAI API client

class OpenAiClient implements LLMClient {
  async createCompletion(prompt: string, maxTokens: number): Promise<string> {
    const response = await openai.createCompletion({
      model: 'text-davinci-003', // Replace with the appropriate model
      prompt: prompt,
      max_tokens: maxTokens
    });
    return response.data.choices[0].text;
  }
}

export { OpenAiClient };