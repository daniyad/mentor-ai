import express from "express";
import { CourseModel } from "../../models/problem-model";
import authFilter from "../../middlewares/auth-filter";
import OpenAI from "openai";
import { DialogueNode, DialogueTree } from "../../types/dialogue-tree";
import { Conversation } from "../../types/conversation";
import { ClaudeClient } from "../../utils/claude_client";

const mentor = express.Router();
const openai = new OpenAI();

// Function to retrieve the dialogue tree for a given problem
function getDialogueTreeForProblem(problem) {
    // Right now, we just return the Hello World dialogue tree
    // Define nodes
    const nodes: DialogueNode[] = [
        {
            id: "root",
            userQuestionText: 'Print "Hello World" to the console',
        },
        {
            id: "ask-how",
            content: {
                type: "TEXT",
                text: 'To write "Hello World" in Python, you can use the print function.',
            },
            userQuestionText: 'How do I print "Hello World" in Python?',
        },
        {
            id: "explain-print",
            content: {
                type: "TEXT",
                text: "The print function in Python outputs text to the console.",
            },
            userQuestionText: "Can you explain the print function?",
        },
        {
            id: "guide-print-text",
            content: {
                type: "TEXT",
                text: 'You can write print("Hello World") to display the text "Hello World".',
            },
            userQuestionText:
                "How do I use the print function to display text?",
        },
        // Add more nodes as needed
    ];

    // Define children map
    const childrenMap = {
        root: ["ask-how", "explain-print"],
        "ask-how": ["guide-print-text"],
        "explain-print": ["guide-print-text"],
        // Add more relationships as needed
    };

    // Find the root node based on the id
    const rootNode = nodes.find((node) => node.id === "root");
    if (!rootNode) {
        throw new Error("Root node not found in the dialogue tree nodes.");
    }

    // Create the dialogue tree with the root node, nodes, and children map
    const helloWorldTree = new DialogueTree(nodes, childrenMap);

    return helloWorldTree;
}

mentor.post("/conversation/next", async (req, res) => {
    // A request from the FE comes as a list of user messages and assistant messages with the latest message being the user message we respond to, and the code
    const { problemId, userInput, nodeId, conversation } = req.body;

    try {
        // Retrieve the ongoing conversation from the database or cache
        const problem = await CourseModel.findOne(
            { "sections.problems.id": problemId },
            { "sections.$": 1 },
        ).then((course) =>
            course?.sections[0].problems.find((p) => p.id === problemId),
        );

        if (!problem) {
            res.status(400).send("Requested problem does not exist");
            return;
        }

        const dialogueTree = getDialogueTreeForProblem(problem);
        const options = dialogueTree.getOptionsFromNode(nodeId);
        const claudeClient = new ClaudeClient();
        const response = await dialogueTree.addToConversationFromNode(
            nodeId,
            conversation,
            claudeClient,
        );

        if (!response) {
            res.status(404).send("Unable to add to conversation from node.");
            return;
        }

        res.json({
            messages: response.messages,
            code_body: response.code_body,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: "An error occurred while fetching the next message",
        });
    }
});

export default mentor;
