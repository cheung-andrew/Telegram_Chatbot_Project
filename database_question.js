import mongoose from "mongoose";
import Joi from "joi";

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
});

export const questionValidationSchema = Joi.object({
    question: Joi.string().required(),
    answer: Joi.string().required()
});

const Question = mongoose.model("wquestion", questionSchema);

export async function createQuestionInDB(questionObj) {
    const question = new Question(questionObj);
    return await question.save();
}

export async function findQuestionsInDB() {
    return await Question.find();
}

export async function findQuestionsByKeywordInDB(keyword) {
    return await Question.find( 
        { $or: [
            { question: { $regex: keyword} },
            { answer:  { $regex: keyword} }
        ] });
}

export async function updateQuestionInDB(id, questionObj) {
    if (!mongoose.isValidObjectId(id)) {
        throw Error("not valid ID!");
    }
    return await Question.updateOne({ _id: id }, questionObj);
}

export async function deleteQuestionInDB(id) {
    if (!mongoose.isValidObjectId(id)) {
        throw Error("not valid ID!");
    }
    return Question.findByIdAndDelete(id);
}






