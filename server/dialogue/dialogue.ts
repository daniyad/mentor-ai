// server/dialogue/dialogueTree.ts

interface DialogueNode {
    id: string;
    text: string;
    options: DialogueOption[];
    metadata?: {
      topic?: string;
      difficulty?: string;
      tags?: string[];
    };
    action?: () => void;
  }
  
  interface DialogueOption {
    text: string;
    nextNodeId: string | null;
    condition?: (state: DialogueState) => boolean;
  }
  
  interface DialogueState {
    [key: string]: any;
  }
  
  class DialogueTree {
    private nodes: Map<string, DialogueNode>;
    private root: DialogueNode;
  
    constructor(nodes: DialogueNode[], rootId: string) {
      this.nodes = new Map(nodes.map(node => [node.id, node]));
      this.root = this.getNode(rootId) || nodes[0];
    }
  
    getNode(id: string): DialogueNode | undefined {
      return this.nodes.get(id);
    }
  
    getRootNode(): DialogueNode {
      return this.root;
    }
  }
  
  export { DialogueTree, DialogueNode, DialogueOption, DialogueState };