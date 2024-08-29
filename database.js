import mongoose from "mongoose";
export * from "./database_question.js"
//2024-8-19  added product 
export * from "./database_product.js"
//2024-8-22  added search 
export * from "./database_search_advancesearch.js";
export async function connectDB() {
    try {
        // Start of DAtabase Authorization username wsuper 2024-8-23
        await mongoose.connect("mongodb://localhost:27017/wsupermarket", {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            autoIndex: true, //make this also true
        });
        console.log("Connected to MongoDB");
        return;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

export async function disconnectDB() {
    try {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (error) {
        console.error("Error disconnecting from MongoDB:", error);
    }
}

