import mongoose from "mongoose";


const problemSchema = new mongoose.Schema({
        id: { type: Number, required: true },
        name: { type: String, required: true },
        difficulty: { type: String, required: true },
        description_body: { type: String, required: true },
        supported_languages: { type: [String], required: true },
        code_body: { type: Object, required: true },
        expected_output: { type: String, required: true },
});

const ProblemsModel = mongoose.model("Problems_New", problemSchema, "problems_new");

export default ProblemsModel;
