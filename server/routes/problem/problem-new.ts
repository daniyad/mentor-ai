import express, { json, response } from "express";
import axios from "axios"
import ProblemsModel from "../../models/problem-model";
import authFilter from "../../middlewares/auth-filter"


const problem_new = express.Router();
const judgeApiKey = process.env.JUDGE_API_KEY ?? ""


problem_new.get("/problems", authFilter, async (req, res) => {
    // TODO(DIN): retrieve user id and all the submitted problems
    const problems = await ProblemsModel.find({})

    if (problems == null || problems == undefined) {
        res.status(404).send("Couldn't find a problem based on the id you provided");
        return
    }
    
    res.status(200).json(problems)
})


problem_new.get("/problem/:name", authFilter, async (req, res) => {
    try {
        const problemName = req.params.name;
        const user = req.user as User; // User information from session

        console.log(`user is ${user}`)

        if (!user) {
            res.status(403).send("User not authenticated.");
            return;
        }

        const problem = await ProblemsModel.findOne({ 'name': problemName });
        if (!problem) {
            res.status(404).send("Couldn't find a problem based on the name provided");
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

problem_new.post("/submitWithJudge0", authFilter, async (req, res) => {
    const { id, code } = req.body;

    const problem = await ProblemsModel.findOne({
        'id': id
    })

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