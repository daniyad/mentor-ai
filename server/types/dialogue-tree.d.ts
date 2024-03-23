export type NodeType = 'TEXT' | 'LARGE_LANGUAGE_MODEL';

export type NodeContent = TextContent | LargeLanguageModelContent;

export interface TextContent {
    type: 'TEXT';
    text: string;
}

export interface LargeLanguageModelContent {
    type: 'LARGE_LANGUAGE_MODEL';
    prompt: string;
}

export interface DialogueNode {
    id: string;
    type: NodeType;
    content: NodeContent;
    children?: DialogueNode[];
    parent?: string;
}

export class DialogueTree {
    constructor(rootNode: DialogueNode, nodes: { [id: string]: DialogueNode });

    private rootNode: DialogueNode;
    private nodes: { [id: string]: DialogueNode };
    private currentNode: DialogueNode;

    navigateToNode(nodeId: string): void;
    getCurrentNode(): DialogueNode;
    getOptionsForCurrentNode(): string[];
    getResponseForCurrentNode(): string | null;
}
