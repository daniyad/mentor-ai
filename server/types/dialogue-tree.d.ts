export type NodeType = "TEXT" | "LARGE_LANGUAGE_MODEL";

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
    async getResponseFromNode(nodeId: string): Promise<NodeContent | null> {
        const currentNode = this.nodes.find(node => node.id === nodeId);
        if (!currentNode) return null;

        switch (currentNode.type) {
            case "TEXT":
                return currentNode.content;
            case "LARGE_LANGUAGE_MODEL":
                try {
                    const response = await getResponseFromLLM(currentNode.content.prompt);
                    return { type: "LARGE_LANGUAGE_MODEL", prompt: response };
                } catch (error) {
                    throw error;
                }
            default:
                return null;
        }
    }
}

// This is a placeholder function for getting a response from a Large Language Model.
// You would replace this with your actual implementation.
async function getResponseFromLLM(prompt: string): Promise<string> {
    // Simulate an API call with a delay
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Response based on the prompt: ${prompt}`);
        }, 1000); // Simulate network delay
    });
}
