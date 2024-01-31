import express, { json, response } from "express";
import axios from "axios"
import {SectionModel} from "../../models/problem-model";
import authFilter from "../../middlewares/auth-filter"


const problem_new = express.Router();
const judgeApiKey = process.env.JUDGE_API_KEY ?? ""


problem_new.get("/sections", authFilter, async (req, res) => {
    try {
        const user = req.user as User; // User information from session
        // Fetch all sections
        const sections = await SectionModel.find({});

        if (!sections || sections.length === 0) {
            res.status(404).send("No sections found.");
            return;
        }

        // Construct the response object
        const response = sections.map(section => {
            // Extract section properties
            const { title, description, problems } = section.toObject();

            // Determine the user's solved status for each problem
            const problemStatus = problems.map(problem => ({
                name: problem.name,
                isSolved: user.attempts.some(attempt =>
                    attempt.problem_id === problem.id && attempt.status === PROBLEM_STATUS.SOLVED
                ),
            }));

            return {
                title,
                description,
                problems: problemStatus,
            };
        });

        res.status(200).json(response);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});


problem_new.get("/problem", authFilter, async (req, res) => {
    try {
        const sectionId = parseInt(req.query.sectionId as string, 10); // Get sectionId from query param
        const problemId = parseInt(req.query.problemId as string, 10); // Get problemId from query param
        const user = req.user as User; // User information from session

        console.log(`section id is ${sectionId} and problem id is ${problemId}`)

        // Fetch the section based on sectionId
        const section = await SectionModel.findOne({ id: sectionId });
        if (!section) {
            res.status(400).send("Requested section does not exist");
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
            attempt.problem_id === problem.id && attempt.status == PROBLEM_STATUS.SOLVED
        );

        // Add isSolved field to the problem object
        const response = { ...problem.toObject(), isSolved };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

problem_new.post("/submit", authFilter, async (req, res) => {
    const { sectionId, problemId, code } = req.body;

    // Fetch the section based on sectionId
    const section = await SectionModel.findOne({ id: sectionId });
    if (!section) {
        res.status(400).send("Requested section does not exist");
        return;
    }

    // Fetch the problem based on problemId within the section
    const problem = section.problems.find(p => p.id == problemId);

    if (problem == null || problem == undefined) {
        res.status(404).send("Couldn't find a problem based on the id you provided");
        return
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

    res.status(200).json(codeSubmissionResponse.data)
})

function stringToBase64(str: string): string {
    return Buffer.from(str).toString('base64');
}

export default problem_new;