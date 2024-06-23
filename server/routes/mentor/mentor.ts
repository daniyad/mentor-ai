import express from "express";
import { DialogueNode } from "../../types/dialogue-tree";
import { Conversation } from "../../types/conversation";
import { DialogueTree } from "../../utils/dialogue-tree";
import { OpenAIClient } from "../../utils/openai_client";

const mentor = express.Router();

// Function to retrieve the dialogue tree for a given problem
function getDialogueTreeForProblem() {
    // Right now, we just return the Hello World dialogue tree
    // Define nodes
    const nodes: DialogueNode[] = [
        {
            id: "root",
            userQuestionText: 'You can ask me any questions you like!',
        },
        {
            id: "test-llm",
            content: {
                type: "LARGE_LANGUAGE_MODEL",
                prompt: 
                `
                    Provide a concise explanation and only Python code snippet for a 'Hello World' program. 
                    Structure your response with a brief explanation followed by the Python code in a Markdown code block on the next line.
                `
            },
            userQuestionText: "Ask the LLM how to write Hello World",
        },
        {
            id: "ask-how",
            content: {
                type: "TEXT",
                text: 'To write "Hello World" in Python, you can use the print function.',
            },
            userQuestionText: 'Can you show me exactly what I need to do?',
        },
        {
            id: "explain-print",
            content: {
                type: "TEXT",
                text: "The print function in Python outputs text to the console.",
            },
            userQuestionText: "Can you explain the print function?",
        },
        // Add more nodes as needed
    ];

    // Define children map
    const childrenMap = {
        root: ["ask-how", "explain-print", "test-llm"],
        "ask-how": ["test-llm"],
        "explain-print": ["test-llm"],
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

const openaiClient = new OpenAIClient();

mentor.post("/conversation/next", async (req, res) => {
    // A request from the FE comes as a list of user messages and assistant messages with the latest message being the user message we respond to, and the code
    const { problemId, nodeId, messages } = req.body;

    const conversation: Conversation = {
        messages: messages,
    }

    try {
        // TODO: Use problemId to fetch appropriate dialogue tree
        const dialogueTree = getDialogueTreeForProblem();
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