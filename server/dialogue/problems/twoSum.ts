// server/dialogue/dialogue.ts
import { AIConversationHandler } from "../aiConversationHandler";
import { UserQuestionNode, UserQuestionTree } from "../dialogue";

// Define the interfaces and class as previously extended

// Example dialogue nodes for the "Two Sum" problem
const twoSumQuestionNodes: UserQuestionNode[] = [
    {
        id: 'start',
        options: [
            {
                text: 'What is the Two Sum problem?',
                nextNodeId: 'explain-two-sum'
            },
            {
                text: 'Can you provide a code example for Two Sum?',
                nextNodeId: 'code-example-two-sum'
            }
        ],
        aiPrompt: async (code: string, chosenOption: string, aiConversationHandler: AIConversationHandler) => {
            return aiConversationHandler.handleUserInput(code, chosenOption)
        },
    },
    {
        id: 'explain-two-sum',
        options: [
            {
                text: 'Can you explain how to approach solving it?',
                nextNodeId: 'approach-two-sum'
            },
            {
                text: 'What are the common pitfalls?',
                nextNodeId: 'pitfalls-two-sum'
            }
        ],
        aiPrompt: async (code: string, chosenOption: string, aiConversationHandler: AIConversationHandler) => {
            return aiConversationHandler.handleUserInput(code, chosenOption)
        }
    },
    {
        id: 'code-example-two-sum',
        options: [
            {
                text: 'Can you explain this code?',
                nextNodeId: 'explain-code'
            },
            {
                text: 'Can you help me write a test for this code?',
                nextNodeId: 'write-test'
            }
        ],
        aiPrompt: async (code: string, chosenOption: string, aiConversationHandler: AIConversationHandler) => {
            return aiConversationHandler.handleUserInput(code, chosenOption)
        }
    },
    {
        id: 'approach-two-sum',
        options: [],
        aiPrompt: async (code: string, chosenOption: string, aiConversationHandler: AIConversationHandler) => {
            return aiConversationHandler.handleUserInput(code, chosenOption)
        }
    },
    {
        id: 'pitfalls-two-sum',
        options: [],
        aiPrompt: async (code: string, chosenOption: string, aiConversationHandler: AIConversationHandler) => {
            return aiConversationHandler.handleUserInput(code, chosenOption)
        }
    },
    {
        id: 'explain-code',
        options: [],
        aiPrompt: async (code: string, chosenOption: string, aiConversationHandler: AIConversationHandler) => {
            return aiConversationHandler.handleUserInput(code, chosenOption)
        }
    },
    {
        id: 'write-test',
        options: [],
        aiPrompt: async (code: string, chosenOption: string, aiConversationHandler: AIConversationHandler) => {
            return aiConversationHandler.handleUserInput(code, chosenOption)
        }
    }
];

// Instantiate the DialogueTree with the nodes and the root node id
const twoSumQuestionTree = new UserQuestionTree(twoSumQuestionNodes, "start");

export { twoSumQuestionTree };