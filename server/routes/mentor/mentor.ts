import express from "express";
import { CourseModel } from "../../models/problem-model";
import authFilter from "../../middlewares/auth-filter";
import OpenAI from "openai";
import { DialogueTree } from "../../types/dialogue-tree";
import { Conversation } from "../../types/conversation";
import { ClaudeClient } from "../../utils/claude_client";

const mentor = express.Router();
const openai = new OpenAI();

mentor.post("/hint", authFilter, async (req, res) => {
    try {
        const courseId = parseInt(req.query.courseId as string, 10); // Get courseId from query param
        const sectionId = parseInt(req.query.sectionId as string, 10); // Get sectionId from query param
        const problemId = parseInt(req.query.problemId as string, 10); // Get problemId from query param
        const code = req.query.code as string;

        const course = await CourseModel.findOne({ id: courseId });
        if (!course) {
            res.status(400).send("The requested course doesn't exist");
        }

        const section = course.sections.find(
            (section) => section.id == sectionId,
        );
        if (!section) {
            res.status(400).send("The requested section doesn't exist");
            return;
        }

        // Fetch the problem based on problemId within the section
        const problem = section.problems.find((p) => p.id == problemId);

        if (!problem) {
            res.status(400).send("Requested problem does not exist");
            return;
        }

        // Retrieve the dialogue tree for the current problem
        const dialogueTree = getDialogueTreeForProblem(problem);

        // Check if the dialogue tree has a predefined response
        const predefinedResponse = dialogueTree.getResponseForUserInput(code);
        if (predefinedResponse) {
            res.json({
                problem_name: problem.name,
                status: "Accepted",
                options: options,
            });
        } else {
            // If no options available, send a prompt for further input or guidance
            res.status(404).send("No options found in the dialogue tree.");
        }

        const systemMessage = `
        You are a helpful assistant. Your job is to help users learn how to program. The
        current problem that your user is working on is this one:
        ${problem.description_body}
        `;

        const userMessage = `Can you make this code work?
        ${code}
        `;

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemMessage,
                },
                {
                    role: "user",
                    content: userMessage,
                },
            ],
            model: "gpt-4-1106-preview",
        });
        let content = completion.choices[0].message.content ?? "";

        res.json({
            problem_name: problem.name,
            status: "Accepted",
            response: content,
        });
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

mentor.post("/dialogue-tree", authFilter, async (req, res) => {
    try {
        const problemId = parseInt(req.body.problemId, 10); // Get problemId from request body
        const userInput = req.body.userInput; // Get user input from request body

        // Fetch the problem based on problemId
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

        // Retrieve the dialogue tree for the current problem
        const dialogueTree = getDialogueTreeForProblem(problem);

        // Check if the dialogue tree has a predefined response
        const options = dialogueTree.getOptionsForUserInput(userInput);
        if (options && options.length > 0) {
            res.json({
                problem_name: problem.name,
                status: "Accepted",
                options: options,
            });
        } else {
            // If no options available, send a prompt for further input or guidance
            res.status(404).send("No options found in the dialogue tree.");
        }

        // If no predefined response, send a prompt for further input or guidance
        res.status(404).send(
            "No predefined response found in the dialogue tree.",
        );
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// Function to retrieve the dialogue tree for a given problem
function getDialogueTreeForProblem(problem) {
    // This function should retrieve the dialogue tree based on the problem's unique characteristics
    // For now, it returns a placeholder dialogue tree
    // Assuming DialogueTree constructor can take a nodeId to initialize the correct node
    return new DialogueTree();
}

mentor.post("/conversation/next", async (req, res) => {
    // A request from the FE comes as a list of user messages and assistant messages with the latest message being the user message we respond to, and the code
    let { conversationFromReq } = req.body;
    const conversation = conversationFromReq as Conversation;
    const claudeClient = new ClaudeClient();

    try {
        // Retrieve the ongoing conversation from the database or cache
        let aiResponse = await claudeClient.createChatCompletion(conversation);

        // Send the AI's response back to the FE
        res.json({
            message: aiResponse.message,
            code_body: aiResponse.code_body,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: "An error occurred while fetching the next message",
        });
    }
});

export default mentor;
