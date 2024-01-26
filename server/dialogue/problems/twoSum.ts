// server/dialogue/dialogue.ts
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
        aiPrompt: () => {
            return {
                text: 'How can I assist you with the Two Sum problem?'
            };
        }
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
        aiPrompt: () => {
            return {
                text: 'The Two Sum problem asks to find the indices of the two numbers in an array that add up to a specific target.'
            };
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
        aiPrompt: () => {
            return {
                code: 'function twoSum(nums, target) {\n' +
                      '    const map = {};\n' +
                      '    for (let i = 0; i < nums.length; i++) {\n' +
                      '        const complement = target - nums[i];\n' +
                      '        if (map[complement] !== undefined) {\n' +
                      '            return [map[complement], i];\n' +
                      '        }\n' +
                      '        map[nums[i]] = i;\n' +
                      '    }\n' +
                      '}\n',
                text: 'Here is a code example for the Two Sum problem.'
            };
        }
    },
    {
        id: 'approach-two-sum',
        options: [],
        aiPrompt: () => {
            return {
                text: 'A common approach is to use a hash map to store the complement of each element and its index as you iterate through the array.'
            };
        }
    },
    {
        id: 'pitfalls-two-sum',
        options: [],
        aiPrompt: () => {
            return {
                text: 'Common pitfalls include not considering duplicate elements or assuming the input array is sorted.'
            };
        }
    },
    {
        id: 'explain-code',
        options: [],
        aiPrompt: () => {
            return {
                text: 'This function iterates through the array, calculating the complement for the target sum and checking if it exists in the hash map.'
            };
        }
    },
    {
        id: 'write-test',
        options: [],
        aiPrompt: () => {
            return {
                text: 'To write a test, you should consider various cases such as an empty array, an array with one element, and an array with multiple elements where two sum up to the target.'
            };
        }
    }
];

// Instantiate the DialogueTree with the nodes and the root node id
const twoSumQuestionTree = new UserQuestionTree(twoSumQuestionNodes, "start");

export { twoSumQuestionTree };