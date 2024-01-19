// server/dialogue/dialogue.ts
import { DialogueNode, DialogueTree } from "./dialogue";
// Define the interfaces and class as previously extended

// Example dialogue nodes for the "Two Sum" problem
const twoSumDialogueNodes: DialogueNode[] = [
    {
        id: "start",
        text: "Welcome to the 'Two Sum' problem. Do you need an explanation of the problem, or would you like to dive into coding?",
        options: [
            {
                text: "Explain the problem to me.",
                nextNodeId: "explainProblem"
            },
            {
                text: "I'm ready to code.",
                nextNodeId: "codingTips"
            }
        ],
        metadata: {
            topic: "Array",
            difficulty: "Easy",
            tags: ["Hash Table", "Array"]
        }
    },
    {
        id: "explainProblem",
        text: "The 'Two Sum' problem asks you to find two numbers in an array that add up to a specific target number. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
        options: [
            {
                text: "Got it, any coding tips?",
                nextNodeId: "codingTips"
            },
            {
                text: "Can I see an example?",
                nextNodeId: "showExample"
            }
        ]
    },
    {
        id: "showExample",
        text: "Sure, here's an example: Given nums = [2, 7, 11, 15], target = 9, because nums[0] + nums[1] = 2 + 7 = 9, return [0, 1].",
        options: [
            {
                text: "I understand now, let's start coding.",
                nextNodeId: "codingTips"
            },
            {
                text: "I need some hints.",
                nextNodeId: "hints"
            }
        ]
    },
    {
        id: "codingTips",
        text: "Remember to consider the time complexity of your solution. A brute force approach would be to check each pair of numbers, but there's a more efficient way using a hash table.",
        options: [
            {
                text: "I'd like a hint, please.",
                nextNodeId: "hints"
            },
            {
                text: "I'll try on my own first.",
                nextNodeId: null // End of the dialogue
            }
        ]
    },
    {
        id: "hints",
        text: "Think about how a hash table can be used to store and quickly retrieve the index of the complement numbers you need.",
        options: [
            {
                text: "I'll try with this hint.",
                nextNodeId: null // End of the dialogue
            },
            {
                text: "I'm stuck, I need more help.",
                nextNodeId: "additionalResources"
            }
        ]
    },
    {
        id: "additionalResources",
        text: "No problem! Here are some resources that might help you: [Link to Two Sum problem discussion], [Link to a tutorial on hash tables].",
        options: [
            {
                text: "Thanks, I'll check these out.",
                nextNodeId: null // End of the dialogue
            }
        ]
    }
];

// Instantiate the DialogueTree with the nodes and the root node id
const twoSumDialogueTree = new DialogueTree(twoSumDialogueNodes, "start");

export { twoSumDialogueTree };