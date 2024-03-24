import { DialogueNode } from "../types/dialogue-tree";

export class DialogueTree {
    constructor(nodes: DialogueNode[], childrenMap: { [id: string]: string[] }) {
        this.nodes = nodes;
        this.childrenMap = childrenMap;
    }

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

        if (!currentNode.content) {
            return conversation;
        }

        switch (currentNode.content.type) {
            case "TEXT":
                conversation.messages.push({
                    role: "assistant",
                    text: currentNode.content,
                });
                return conversation;
            case "LARGE_LANGUAGE_MODEL":
                const newMessage: Message = {
                    role: "user",
                    text: currentNode.userQuestionText,
                };
                conversation.messages.push(newMessage);
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
