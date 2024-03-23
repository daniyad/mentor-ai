export type NodeType = 'TEXT' | 'LARGE_LANGUAGE_MODEL';

export interface DialogueNode {
    id: string;
    type: NodeType;
    content?: string;
    children?: DialogueNode[];
    parent?: string;
}

export class DialogueTree {
    constructor(rootNode?: DialogueNode);

    private rootNode: DialogueNode;
    private currentNode: DialogueNode;

    navigateToNode(nodeId: string): void;
    getCurrentNode(): DialogueNode;
    getOptionsForCurrentNode(): string[];
    getResponseForCurrentNode(): string | null;
}
