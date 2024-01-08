import OpenAI from "openai";
import { MessageContentText } from "openai/resources/beta/threads/messages/messages";

import * as fs from 'fs';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function(){
    // Read the two_sum_solution.py file and store its content in the variable twoSumSolution
let twoSumSolution = fs.readFileSync("two_sum_solution.py", "utf8");

// The structure of twoSumSolution is a string containing the Python code for solving the two-sum problem.
// It reads a list of numbers and a target number, and returns a pair of indices where the corresponding numbers add up to the target.
// The solution uses a dictionary to store potential matches for each number, and iterates over the list only once, resulting in O(n) time complexity.

const openai = new OpenAI();

const thread = await openai.beta.threads.create({
    messages: [
      {
        "role": "user",
        "content": `Make this code work: ${twoSumSolution}`,
      }
    ]
  });    

const run = await openai.beta.threads.runs.create(
    thread.id,
    {
        assistant_id: "asst_7muYZP6iEa04iPJ7FYBJgPiR"
    }
)

console.log(run);

await sleep(30_000);

const retrievedRun = await openai.beta.threads.runs.retrieve(
    run.thread_id,
    run.id
);

if(retrievedRun.status == "completed"){
    const threadMessages = await openai.beta.threads.messages.list(
        run.thread_id
    );
    console.log(threadMessages);
    const lastMessage = threadMessages.data[0]
    const textContent = lastMessage.content[0] as MessageContentText;

    console.log(textContent)
} else {        
    console.log("not comopleted")
}
})()