
import express from "express";
import {SectionModel} from "../../models/problem-model";
import authFilter from "../../middlewares/auth-filter"
import OpenAI from "openai";


const mentor = express.Router();
const openai = new OpenAI();

mentor.post("/hint", authFilter, async (req, res) => {
    try {
        const { sectionId, problemId, code } = req.body;

        const section = await SectionModel.findOne({ id: sectionId });
        if (!section) {
            res.status(400).send("Requested section does not exist");
            return;
        }

        // Fetch the problem based on problemId within the section
        const problem = section.problems.find(p => p.id == problemId)

        const systemMessage = `
        You are a helpful assistant. Your job is to help users learn how to program. The
        current problem that your user is working on is this one:
        ${problem.description_body}
        `
        
        const userMessage = `Can you make this code work?
        ${code}
        `

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemMessage
                },
                {
                    role: "user",
                    content: userMessage
                }
            ],
            model: "gpt-4-1106-preview"
        });
        let content = completion.choices[0].message.content ?? ''

        res.json({
            problem_name: problem.name,
            status: "Accepted",
            response: content
        })

    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

export default mentor;