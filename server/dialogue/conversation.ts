// server/dialogue/conversation.ts

interface Message {
    speaker: 'user' | 'ai';
    text: string;
    code?: string;
  }
  
  class Conversation {
    private history: Message[];
  
    constructor() {
      this.history = [];
    }
  
    addMessage(speaker: 'user' | 'ai', text: string, code?: string) {
      this.history.push({ speaker, text, code });
    }
  
    getHistory(): Message[] {
      return this.history;
    }
  
    getLastMessage(): Message | null {
      if (this.history.length === 0) return null;
      return this.history[this.history.length - 1];
    }
  }
  
  export { Conversation, Message };