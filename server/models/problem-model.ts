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
        expected_output: string,
}

const problemSchema = new mongoose.Schema<DbProblem>({
        id: { type: Number, required: true },
        name: { type: String, required: true },
        difficulty: { type: String, required: true },
        description_body: { type: String, required: true },
        supported_languages: { type: [String], required: true },
        code_body: { type: [Object], required: true },
        expected_output: { type: String, required: true },
});

// New Section Schema
const sectionSchema = new mongoose.Schema({
        id: {type: Number, required: true, unique: true},
        title: { type: String, required: true },
        description: { type: String, required: true },
        problems: [problemSchema]  // Embedding problem documents directly
});

const ProblemsModel = mongoose.model("Problems_New", problemSchema, "problems_new");
const SectionModel = mongoose.model("Section", sectionSchema, "sections_new");

export { SectionModel };
