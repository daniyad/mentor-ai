import express, { json, response } from "express";
import axios from "axios";
import ProblemsModel from "../models/problem-model";

const dialogue = express.Router();

dialogue.post("/submitDialogueOption", async (req, res) => {
    const { problemId, chosenOption, currentCode } = req.body;

    const problem = await ProblemsModel.findOne({
        'id': problemId
    });

    // TODO: Reference the problem dialogue in server/dialogue
    // TODO: Set up conversation handler and provide it with the info it needs
    // TODO: Take the return AiResponse and provide it to the user in a Conversation object
    // TODO: Use the conversation object and serialize it for the user
})