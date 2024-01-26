// server/dialogue/dialogueTree.ts

interface UserQuestionNode {
    id: string;
    options: UserQuestionOption[];
    aiPrompt?: () => AiResponse;
  }

  interface AiResponse {
    code?: string;
    text?: string;
  }
  
  interface UserQuestionOption {
    text: string;
    nextNodeId: string | null;
  }
  
class UserQuestionTree {
  private nodes: Map<string, UserQuestionNode>;
  private root: UserQuestionNode;
  
  constructor(nodes: UserQuestionNode[], rootId: string) {
    this.nodes = new Map(nodes.map(node => [node.id, node]));
    this.root = this.getNode(rootId) || nodes[0];
  }
  
  getNode(id: string): UserQuestionNode | undefined {
    return this.nodes.get(id);
  }
  
  getRootNode(): UserQuestionNode {
    return this.root;
  }
}
  
export { UserQuestionTree, UserQuestionNode, UserQuestionOption};