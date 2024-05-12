export interface Message {
    role: "assistant" | "user";
    text: string;
}

export interface Conversation {
    messages: Message[];
    code_body?: string;
}

export interface AiResponse {
    message: string;
    code_body: string;
}

export interface LLMClient {
    createChatCompletion(
        conversation: Conversation,
    ): Promise<AiResponse | null>;
}
