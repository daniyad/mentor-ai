// server/dialogue/aiConversationHandler.ts

import { Conversation } from './conversation';
import { LLMClient } from './llmClient';
import { AiResponse } from './dialogue';

class AIConversationHandler {
  constructor(private conversation: Conversation, private llmClient: LLMClient) {}

  async handleUserInput(userCode: string, optionText: string): Promise<AiResponse> {
    this.conversation.addMessage('user', optionText, userCode);
    const prompt = this.createPrompt(userCode, optionText);
    const aiText = await this.llmClient.createChatCompletion(prompt, this.conversation);

    if (aiText == null){
        throw new Error('AI text generation failed.');
    }

    this.conversation.addMessage('assistant', aiText);
    return this.conversation;
  }

  private createPrompt(userCode: string, optionText: string): string {
    const historyText = this.conversation.getHistory()
      .map(message => `${message.speaker}: ${message.text}`)
      .join('\n');
    return `User has written the following code:\n${userCode}\n\n` +
           `The following conversation has taken place:\n${historyText}\n\n` +
           `The user has selected the option: "${optionText}".\n\n` +
           `Based on the user's selection, provide the appropriate response or guidance.`;
  }
}

export { AIConversationHandler };