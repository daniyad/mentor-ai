import { Message, LLMClient } from "./conversation";

export type NodeType = "TEXT" | "LARGE_LANGUAGE_MODEL" | "EMPTY";

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
    type: NodeType;
    content: NodeContent;
    userQuestionText?: string;
    children?: DialogueNode[];
    parent?: string;
}

export class DialogueTree {
    constructor(
        rootNode: DialogueNode,
        nodes: DialogueNode[],
        childrenMap: { [id: string]: string[] },
    );

    private rootNode: DialogueNode;
    private nodes: DialogueNode[];
    private childrenMap: { [id: string]: string[] };

    getOptionsFromNode(nodeId: string): DialogueNode[] {
        const childrenIds = this.childrenMap[this.currentNode.id] || [];
        return childrenIds.map((id) =>
            this.nodes.find((node) => node.id === id),
        );
    }
    async addToConversationFromNode(
        nodeId: string,
        conversation: Conversation,
        llmClient: LLMClient,
    ): Promise<Conversation | null> {
        const currentNode = this.nodes.find((node) => node.id === nodeId);
        if (!currentNode) return null;

        switch (currentNode.type) {
            case "EMPTY":
                return conversation;
            case "TEXT":
                conversation.messages.append({
                    role: "assistant",
                    text: currentNode.content,
                });
                return conversation;
            case "LARGE_LANGUAGE_MODEL":
                const newMessage: Message = {
                    role: "user",
                    text: currentNode.userQuestionText,
                };
                conversation.messages.append(newMessage);
                const response =
                    await llmClient.createChatCompletion(conversation);
                conversation.messages.append({
                    role: "assistant",
                    text: response.message,
                });

                return conversation;
        }
    }
}
