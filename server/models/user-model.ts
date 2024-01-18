import mongoose, { Document } from "mongoose";

enum PROBLEM_STATUS{
    ATTEMPTED,
    SOLVED
}

interface Attempt {
    problem_id: number,
    status: PROBLEM_STATUS
}

interface DbUser extends Document {
    id: number;
    name: string;
    email: string;
    password: string;
    preferred_coding_language: string;
    language: string;
    attempts: [Attempt]
}

const userSchema = new mongoose.Schema<DbUser>({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    preferred_coding_language: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    attempts: {
        type: [Object],
        required: true,
    }
});

const UsersModel = mongoose.model<DbUser>("Users_New", userSchema, "users_new");

export default UsersModel;