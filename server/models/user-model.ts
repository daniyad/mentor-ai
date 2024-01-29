import mongoose, { Document } from "mongoose";


interface DbUser extends Document {
    name: string;
    email: string;
    password: string;
    preferred_coding_language: string;
    language: string;
    attempts: [Attempt]
}

const userSchema = new mongoose.Schema<DbUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
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