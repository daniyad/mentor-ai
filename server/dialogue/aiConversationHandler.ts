// server/dialogue/aiConversationHandler.ts

import { Conversation } from './conversation';
import { LLMClient } from './llmClient';
import { AiResponse, EvaluationResponse } from './dialogue';

class AIConversationHandler {
  public conversation: Conversation;
  private llmClient: LLMClient;

  constructor(private providedLLMClient: LLMClient) {
    this.conversation = new Conversation();
    this.llmClient = providedLLMClient;
  }

  async handleUserInput(userCode: string, optionText: string): Promise<AiResponse> {
    this.conversation.addMessage('user', optionText, userCode);
    const prompt = this.createPrompt(userCode, optionText);
    const aiText = await this.llmClient.createChatCompletion(prompt, this.conversation);

    if (aiText == null){
        throw new Error('AI text generation failed.');
    }

    this.conversation.addMessage('assistant', aiText.text, aiText.code);
    return {
      code: aiText.code,
      text: aiText.text
    };
  }

  private createPrompt(userCode: string, optionText: string): string {
    return JSON.stringify({
      "code": userCode,
      "text": optionText
    })
  }
}

export { AIConversationHandler };