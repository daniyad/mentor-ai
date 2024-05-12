import express from "express";
import axios from "axios"
import { CourseModel } from "../../models/problem-model";
import authFilter from "../../middlewares/auth-filter"
import UsersModel from "../../models/user-model";


const problem_new = express.Router();
const judgeApiKey = process.env.JUDGE_API_KEY ?? ""


problem_new.get("/course", authFilter, async (req, res) => {
    try {
        const user = req.user as User; // User information from session
        const courseId = parseInt(req.query.courseId as string, 10); // Get courseId from query param

        const course = await CourseModel.findOne({ id: courseId }).populate('sections.problems');
        if (!course) {
            res.status(400).send("The requested course doesn't exist")
            return;
        }
        // TODO(Din): Update data model to contain course metadata
        const courseMetadata = {
            level: "Beginner",
            timeToComplete: 25,
            prerequisites: []
        }

        // Construct the response object
        const response = {
            id: course.id,
            title: course.title,
            short_description: course.short_description,
            description: course.description,
            skills: course.skills,
            metadata: courseMetadata,
            sections: course.sections.map(section => {
                // Extract section properties
                const { id, title, short_description, problems } = section;

                // Construct problems info
                const problemsInfo = problems.map(problem => ({
                    id: problem.id,
                    name: problem.name,
                    difficulty: problem.difficulty,
                    isSolved: user.attempts.some(attempt =>
                        attempt.course_id === courseId &&
                        attempt.section_id === section.id && 
                        attempt.problem_id === problem.id && 
                        attempt.status === "SOLVED"
                    ),
                }));

                return {
                    id,
                    title,
                    short_description,
                    problems: problemsInfo,
                };
            }),
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

problem_new.get("/problem", authFilter, async (req, res) => {
    try {
        const courseId = parseInt(req.query.courseId as string, 10); // Get courseId from query param
        const sectionId = parseInt(req.query.sectionId as string, 10); // Get sectionId from query param
        const problemId = parseInt(req.query.problemId as string, 10); // Get problemId from query param
        const user = req.user as User; // User information from session

        const course = await CourseModel.findOne({ id: courseId })
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

        // Check if the problem is solved by the user
        const isSolved = user.attempts.some(attempt =>
            attempt.course_id === courseId && 
            attempt.section_id === sectionId &&
            attempt.problem_id === problemId &&
            attempt.status == "SOLVED"
        );

        const pythonCodeTemplate = problem.code_body.find(template => template.language === 'Python');
        
        const response = {
            id: problem.id,
            name: problem.name,
            difficulty: problem.difficulty,
            description_body: problem.description_body,
            code_body: pythonCodeTemplate,
            isSolved: isSolved
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

problem_new.post("/submit", authFilter, async (req, res) => {
    const courseId = parseInt(req.query.courseId as string, 10); // Get courseId from query param
    const sectionId = parseInt(req.query.sectionId as string, 10); // Get sectionId from query param
    const problemId = parseInt(req.query.problemId as string, 10); // Get problemId from query param
    const code = req.body.code as string // Get submitted code

    const user = req.user as User; // User information from session
    const course = await CourseModel.findOne({ id: courseId })
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

    const expectedOutput = problem.expected_output
    const submissionUrl = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*"
    const pythonLanguageId = 71

    const submissionHeaders = {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        "X-RapidAPI-Key": judgeApiKey,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    }

    const optionsForSubmittingCode = {
        method: "POST",
        url: submissionUrl,
        headers: submissionHeaders,
        data: {
            "language_id": pythonLanguageId,
            "source_code": stringToBase64(code),
            "expected_output": stringToBase64(expectedOutput)
        }
    }

    const submissionResponse = await axios(optionsForSubmittingCode);
    if (!submissionResponse || submissionResponse.status != 201) {
        res.status(500).send("There was an error in our servers, please try again later")
        return
    }

    //waiting for the code to be complete
    await new Promise(resolve => setTimeout(resolve, 5000));

    const token = submissionResponse.data.token
    const submissionStatusUrl =
        "https://judge0-ce.p.rapidapi.com/submissions/" + token + "?base64_encoded=true&fields=*"
    const submissionStatusHeaders = {
        "X-RapidAPI-Key": judgeApiKey,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    }

    const optionsForRetrievingResult = {
        method: "GET",
        url: submissionStatusUrl,
        headers: submissionStatusHeaders,
    }

    const codeSubmissionResponse = await axios(optionsForRetrievingResult)
    if (!codeSubmissionResponse || codeSubmissionResponse.status != 200) {
        res.status(500).send("There was an error in our servers, please try again later")
        return
    }
    const submissionStatus = codeSubmissionResponse.data.status.description
    if (submissionStatus == "Accepted") {
        console.log("HELLOOOOO SOLVED")
        const dbUser = await UsersModel.findById(user.id); // Fetch the user from the database
        dbUser.attempts.push({
            section_id: sectionId,
            course_id: courseId,
            problem_id: problemId,
            status: "SOLVED"
        });
        await dbUser.save(); // Save the user
    }
    
    res.status(200).json(codeSubmissionResponse.data.status.description)
})

function stringToBase64(str: string): string {
    return Buffer.from(str).toString('base64');
}

export default problem_new;