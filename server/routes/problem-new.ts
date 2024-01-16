import express, { json, response } from "express";
import axios from "axios"
import ProblemsModel from "../models/problem-model";

const problem_new = express.Router();
const judgeApiKey = process.env.JUDGE_API_KEY ?? ""

problem_new.get("/problem/:id", async (req, res) => {
    const id = req.params.id;

    const problem = await ProblemsModel.findOne({
        'id': id
    })

    if (problem == null || problem == undefined) {
        res.status(404).send("Couldn't find a problem based on the id you provided");
        return
    }

    res.status(200).json(`${problem} is found`)
})

problem_new.post("/submitWithJudge0", async (req, res) => {
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
    await new Promise(resolve => setTimeout(resolve, 3000));

    const token = submissionResponse.data.token
    const submissionStatusUrl = 
    "https://judge0-ce.p.rapidapi.com/submissions/" + token + "?base64_encoded=true&fields=*"
    const submissionStatusHeaders = {
        "X-RapidAPI-Key": "35c9225c5cmshcf78f7b581c247bp1d192ejsn072c0d9c96eb",
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