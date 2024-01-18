import mongoose from "mongoose";


interface CodeBody {
        language: string,
        code_template: string
}
interface DbProblem extends Document {
        id: number,
        name: string;
        difficulty: string,
        description_body: string,
        supported_languages: [string],
        code_body: [CodeBody],
        expected_output: { type: String, required: true },
}

const problemSchema = new mongoose.Schema({
        id: { type: Number, required: true },
        name: { type: String, required: true },
        difficulty: { type: String, required: true },
        description_body: { type: String, required: true },
        supported_languages: { type: [String], required: true },
        code_body: { type: [Object], required: true },
        expected_output: { type: String, required: true },
});

const ProblemsModel = mongoose.model("Problems_New", problemSchema, "problems_new");

export default ProblemsModel;
