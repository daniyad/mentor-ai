import { DialogueNode } from "../types/dialogue-tree";
import { Message, Conversation } from "../types/conversation";
import { LLMClient } from "../types/conversation";

export class DialogueTree {
    constructor(
        nodes: DialogueNode[],
        childrenMap: { [id: string]: string[] },
    ) {
        const rootNode = nodes.find((node) => node.id === "root");
        if (!rootNode) {
            throw new Error('DialogueTree requires a node with ID "root"');
        }
        this.nodes = nodes;
        this.childrenMap = childrenMap;
    }

    private nodes: DialogueNode[];
    private childrenMap: { [id: string]: string[] };

    getOptionsFromNode(nodeId: string): DialogueNode[] {
        const childrenIds = this.childrenMap[nodeId] || [];
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

        if (!currentNode.content) {
            conversation.messages.push({
                role: "assistant",
                text: currentNode.userQuestionText,
            });
            return conversation;
        }

        switch (currentNode.content.type) {
            case "TEXT":
                conversation.messages.push({
                    role: "user",
                    text: currentNode.userQuestionText,
                })
                conversation.messages.push({
                    role: "assistant",
                    text: currentNode.content.text,
                });
                return conversation;
            case "LARGE_LANGUAGE_MODEL":
                const newMessage: Message = {
                    role: "user",
                    text: currentNode.content.prompt,
                };
                conversation.messages.push(newMessage);
                const response =
                    await llmClient.createChatCompletion(conversation);
                conversation.messages.push({
                    role: "assistant",
                    text: response.message,
                });

                return conversation;
        }
    }
}
