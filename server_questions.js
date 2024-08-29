import { findQuestionsInDB, findQuestionsByKeywordInDB, createQuestionInDB, deleteQuestionInDB, updateQuestionInDB, questionValidationSchema } from "./database.js";

export function getQuestions(app) {
    app.get("/getquestions", async (_, res) => {
        await findQuestionsInDB()
            .then(questions => {
                console.log(questions);
                res.end(JSON.stringify(questions));
            })
            .catch(error => {
                console.error("Error caught: Get questions fail", error);
                res.status(500).json({ error: error });
            });
    });
}

export function getQuestionWithKeyword(app) {
    app.get("/question/:keyword", async (req, res) => {
        const keyword = req.params.keyword;
        await findQuestionsByKeywordInDB(keyword)
            .then(question => {
                console.log(question);
                res.end(JSON.stringify(question));
            })
            .catch (error => {
                console.error("Error caught: Search questions fail", err);
                res.status(500).json({ error: error });
            });
    });
}

export function createQuestion(app, authorize) {
    app.post("/createquestion", authorize, async (req, res) => {
        const questionToCreate = req.body;
        const { error } = questionValidationSchema.validate(questionToCreate);
        if (error) return res.status(400).send(error.details[0].message);
        await createQuestionInDB(questionToCreate).
            then(question => {
                console.log("Question Created:", question);
                res.status(201).send(JSON.stringify(question));
            })
            .catch(error => {
                console.error("Error creating question:", error);
                res.status(400).json({ err: "Error caught: Create question fail." });
            });
    });
}

export function editQuestion(app, authorize) {
    app.put("/editquestion/:id", authorize, async (req, res) => {
        const id = req.params.id;
        const questionToEdit = req.body;
        const { error } = questionValidationSchema.validate(questionToEdit);
        if (error) return res.status(400).send(error.details[0].message);
        await updateQuestionInDB(id, questionToEdit)
            .then(result => {
                console.log(result);
                res.status(201).send(JSON.stringify(result));
            })
            .catch(error => {
                console.error("Error finding user:", error);
                return res.status(404).send(error.message);
            })
    });
}

export function delQuestion(app, authorize) {
    app.delete("/delquestion/:id", authorize, async (req, res) => {
        let id = req.params.id;
        deleteQuestionInDB(id)
            .then(question => {
                if (!question) return res.status(404).send();
                console.log("Question Deleted:", question);
                res.end(JSON.stringify(question));
            })
            .catch(error => {
                console.error("Error deleting question:", error);
                return res.status(404).send(error.message);
            })
    });
}
