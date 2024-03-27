import { Message, LLMClient } from "./conversation";

export type NodeContent = TextContent | LargeLanguageModelContent;

export interface TextContent {
    type: "TEXT";
    text: string;
}

export interface LargeLanguageModelContent {
    type: "LARGE_LANGUAGE_MODEL";
    prompt: string;
}

export interface DialogueNode {
    id: string;
    content?: NodeContent;
    userQuestionText: string;
    children?: DialogueNode[];
    parent?: string;
}
