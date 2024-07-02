import express from "express";
import { DialogueNode } from "../../types/dialogue-tree";
import { Conversation } from "../../types/conversation";
import { DialogueTree } from "../../utils/dialogue-tree";
import { OpenAIClient } from "../../utils/openai_client";
import { problemNodesMap } from "./dialogue-node";

const mentor = express.Router();

// Function to retrieve the dialogue tree for a given problem
const getDialogueTreeForProblem = (problemId: number) => {
    // Right now, we just return the Hello World dialogue tree
    // Define nodes
    const nodes = problemNodesMap[problemId]

    console.log(nodes)
    // Define children map
    const childrenMap = generateChildrenMap(nodes)

    // Find the root node based on the id
    const rootNode = nodes.find((node) => node.id === "root");
    if (!rootNode) {
        throw new Error("Root node not found in the dialogue tree nodes.");
    }

    // Create the dialogue tree with the root node, nodes, and children map
    const helloWorldTree = new DialogueTree(nodes, childrenMap);

    return helloWorldTree;
}

const generateChildrenMap = (dialogueNodes: DialogueNode[]) => {
    const childrenMap = {};

    dialogueNodes.forEach((node) => {
        if (node.parentIds) {
            node.parentIds.forEach((parentId) => {
                if (!childrenMap[parentId]) {
                    childrenMap[parentId] = [];
                }
                childrenMap[parentId].push(node.id);
            });
        } else {
            if (!childrenMap['root']) {
                childrenMap['root'] = [];
            }
            childrenMap['root'].push(node.id);
        }
    });

    return childrenMap;
};

const openaiClient = new OpenAIClient();

mentor.post("/conversation/next", async (req, res) => {
    // A request from the FE comes as a list of user messages and assistant messages with the latest message being the user message we respond to, and the code
    const { problemId, nodeId, messages } = req.body;

    const conversation: Conversation = {
        messages: messages,
    }

    try {
        const dialogueTree = getDialogueTreeForProblem(problemId as number);
        const options = dialogueTree.getOptionsFromNode(nodeId);

        const response = await dialogueTree.addToConversationFromNode(
            nodeId,
            conversation,
            openaiClient,
        );

        if (!response) {
            res.status(500).send("Unable to add to conversation from node.");
            return;
        }

        const updatedText = fixConcatenation(response.messages[response.messages.length - 1].text)
        response.messages[response.messages.length - 1].text = updatedText
        res.json({
            options: options,
            messages: response.messages,
            code_body: response.code_body,
            option_title: "🤖 Chat with me 🤖"
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: "An error occurred while fetching the next message",
        });
    }
});

const fixConcatenation = (str: string): string => {
    // Split the string into lines
    let lines = str.split('+');

    // Trim whitespace from the start and end of each line
    lines = lines.map(line => line.trim());

    // Join the lines back together with newline characters
    let fixedStr = lines.join('\n');

    // Remove the extra quotes around the string
    fixedStr = fixedStr.replace(/^'(.*)'$/, '$1');

    // Unescape any escaped characters
    fixedStr = fixedStr.replace(/\\n/g, '\n').replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\');

    return fixedStr;
}

export default mentor;