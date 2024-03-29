import express, { json, response } from "express";
import { writeTestFile } from "../utils/createTest";
import ProblemModel from "../models/problem";
import UserModel from "../models/user";
import { DProblem } from "../models/problem";
import {
    sortByAcceptance,
    sortByDifficulty,
    sortByTitle,
} from "../utils/utils";
import axios from "axios"

import OpenAI from "openai";

const openai = new OpenAI();

const problem = express.Router();
const judgeApiKey = process.env.JUDGE_API_KEY ?? ""

problem.get("/notFound", (req, res) => {
    res.status(404).send("Problem page not found not found");
});


problem.post("/submitWithJudge0", async (req, res) => {
    const { id, problem_name, code } = req.body;

    const problem = await ProblemModel.findOne({
        "main.name": problem_name,
    })

    if (problem == null || problem == undefined) {
        res.status(404).send("Problem page not found not found");
        return
    }

    // TODO(DIN): update the existing schema to include the expected_output field
    const expectedOutput = "hello-world"
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
        "X-RapidAPI-Host": judgeApiKey,
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
    res.status(200).json(codeSubmissionResponse.data.status)
})

function stringToBase64(str: string): string {
    return Buffer.from(str).toString('base64');
}


problem.post("/all", async (req, res) => {
    const { id } = req.body;
    const search = req.query.search || "";
    const difficulty = req.query.difficulty || "";
    const acceptance = req.query.acceptance || "";
    const title = req.query.title || "";

    try {
        const allProblems = await ProblemModel.find(
            { "main.name": { $regex: search, $options: "i" } },
            "main.id main.name main.acceptance_rate_count main.difficulty main.like_count main.dislike_count"
        )
            .sort({ "main.id": 1 })
            .exec();

        const allProblemsSorted = sortByAcceptance(
            acceptance.toString() as Sort,
            sortByDifficulty(
                difficulty.toString() as Sort,
                sortByTitle(title.toString() as Sort, allProblems)
            )
        );

        const user = await UserModel.findById(id);
        const sOrA = {
            solved: user?.problems_solved,
            attempted: user?.problems_attempted,
        };

        let allProblemsArray: DProblem[] = JSON.parse(
            JSON.stringify(allProblemsSorted)
        );

        if (sOrA.attempted) {
            for (let i = 0; i < allProblemsArray.length; i++) {
                if (sOrA.attempted.includes(allProblemsArray[i].main.name)) {
                    allProblemsArray[i].main.status = "attempted";
                }
            }
        }
        if (sOrA.solved) {
            for (let i = 0; i < allProblemsArray.length; i++) {
                if (sOrA.solved.includes(allProblemsArray[i].main.name)) {
                    allProblemsArray[i].main.status = "solved";
                }
            }
        }

        res.json(allProblemsArray);
    } catch (e) {
        console.log(e);
        res.json({ success: false, message: "Internal Server Error" });
    }
});

problem.post<
    { name: string },
    Submission[],
    { code: string; id: string; problem_name: string }
>("/submit/:name", async (req, res) => {
    const { name } = req.params;
    const { id, problem_name } = req.body;

    try {
        const problem = await ProblemModel.findOne({
            "main.name": name,
        });
        const user = await UserModel.findById(id);
        if (!user) {
            res.json([
                {
                    problem_name: problem_name,
                    status: "Runtime Error",
                    error: "user not found",
                    time: new Date(),
                    runtime: 0,
                    language: "JavaScript",
                    memory: Math.random() * 80,
                    code_body: undefined,
                },
            ]);
            return;
        }
        let history: Submission[] | null;
        if (user.submissions) {
            history = user.submissions;
        } else {
            history = null;
        }
        if (problem) {
            writeTestFile(req.body.code, problem.test, problem.function_name)
                .then(async (resolve) => {
                if (resolve.stdout != undefined) { 
                        console.log(resolve.stdout);
                        let submission: Submission[] = [
                            {
                                problem_name: problem_name,
                                status: resolve.stdout.status,
                                error: resolve.stdout.error_message,
                                time: resolve.stdout.date,
                                runtime: resolve.stdout.runtime,
                                language: "JavaScript",
                                memory: Math.random() * 80,
                                code_body: resolve.code_body,
                                input: resolve.stdout.input,
                                expected_output: resolve.stdout.expected_output,
                                user_output: resolve.stdout.user_output,
                            },
                        ];
                        if (history != null) {
                            submission.push(...history);
                        }

                        const subsByName = submission.filter(
                            (elem) => elem.problem_name === problem_name
                        );
                        user.submissions = submission;

                        if (submission[0].status === "Accepted") {
                            if (!user.problems_solved.includes(problem_name)) {
                                user.problems_solved.push(problem_name);
                                user.problems_solved_count += 1;
                            }
                        } else {
                            if (
                                !user.problems_attempted.includes(problem_name)
                            ) {
                                user.problems_attempted.push(problem_name);
                            }
                        }
                        await user.save();
                        res.json(subsByName);
                    }
                })
                .catch(async (e) => {
                    let submission: Submission[] = [
                        {
                            problem_name: problem_name,
                            status: "Runtime Error",
                            error: e,
                            time: new Date(),
                            runtime: 0,
                            language: "JavaScript",
                            memory: Math.random() * 80,
                            code_body: undefined,
                        },
                    ];
                    if (history) {
                        submission.push(...history);
                    }

                    if (!user.problems_attempted.includes(problem_name)) {
                        user.problems_attempted.push(problem_name);
                    }

                    const subsByName = submission.filter(
                        (elem) => elem.problem_name === problem_name
                    );

                    user.submissions = submission;
                    await user.save();
                    res.json(subsByName);
                });
        }
    } catch (e) {
        console.log(e);
    }
});

problem.post<{ name: string }, Submission[], { id: string }>(
    "/submissions/:name",

    async (req, res) => {
        const { name } = req.params;
        const { id } = req.body;
        try {
            const user = await UserModel.findById(id);
            if (!user) {
                res.json([]);
                return;
            }
            if (!user.submissions) {
                res.json([]);
                return;
            }

            const subsByName = user.submissions.filter(
                (elem) => elem.problem_name === name
            );

            res.json(subsByName);
        } catch (e) {
            console.log(e);
            res.json([]);
        }
    }
);

problem.get("/:name", async (req, res) => {
    const { name } = req.params;
    try {
        const problem = await ProblemModel.findOne({
            "main.name": name,
        });
        if (!problem) {
            res.json({ error: "problem not found" });
            return;
        }

        const id = req.query.id as string;
        const user = await UserModel.findById(id);
        const problemJson: DProblem = JSON.parse(JSON.stringify(problem));
        


        res.json(problemJson);
    } catch (e) {
        console.log(e);
        res.json({ error: "An error occurred" });
    }
});

problem.post("/hint/:name", async (req, res) => {
    const { name } = req.params;
    const { id, problem_name,code } = req.body;

    try {
        const problem = await ProblemModel.findOne({
            "main.name": name,
        });
        const user = await UserModel.findById(id);
        
        if(!user) {
            res.json({
                problem_name: problem_name,
                status: "Runtime Error",
                error: "user not found",
            });
            return;
        }

        const systemMessage = `
        You are a helpful assistant. Your job is to help users learn how to program. The
        current problem that your user is working on is this one:
        ${problem?.main.description_body}
        `
        
        const userMessage = `
        Can you make this code work?
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
            problem_name: problem_name,
            status: "Accepted",
            response: content
        })
    } catch (e) {
        console.log(e);
    }
})


problem.get("/:name/editorial", async (req, res) => {
    const name = req.params.name;
    try {
        const problem = await ProblemModel.findOne({
            "main.name": name,
        });
        if (problem) {
            const response = problem.editorial;
            res.json(response);
        }
    } catch (e) {
        console.log(e);
    }
});

export default problem;
