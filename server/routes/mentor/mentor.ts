
import express from "express";
import { CourseModel } from "../../models/problem-model";
import authFilter from "../../middlewares/auth-filter"
import OpenAI from "openai";


const mentor = express.Router();
const openai = new OpenAI();

mentor.post("/hint", authFilter, async (req, res) => {
    try {
        const courseId = parseInt(req.query.courseId as string, 10); // Get courseId from query param
        const sectionId = parseInt(req.query.sectionId as string, 10); // Get sectionId from query param
        const problemId = parseInt(req.query.problemId as string, 10); // Get problemId from query param
        const code = (req.query.code as string)

        const course = await CourseModel.findOne({id: courseId})
        if (!course) {
            res.status(400).send("The requested course doesn't exist")
        }

        const section = course.sections.find(section => section.id == sectionId)
        if (!section) {
            res.status(400).send("The requested section doesn't exist")
            return;
        }

        // Fetch the problem based on problemId within the section
        const problem = section.problems.find(p => p.id == problemId);

        if (!problem) {
            res.status(400).send("Requested problem does not exist");
            return;
        }

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