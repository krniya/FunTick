import mongoose from "mongoose";
import { app } from "./app";

//* MongoDB connection function
const startDBConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!); //* Path to mongodb services [kubernetes]
        console.log("Connected to Tickets MongoDB");
    } catch (err) {
        console.log(err);
    }
};

//* Environmnet variable defination check function
const envVariableCheck = () => {
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined");
    }
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI must be defined");
    }
};

//* Checking environment variable declearation
envVariableCheck();

//* Connecting to mongoDB
startDBConnection();

app.listen(3000, () => {
    console.log("Tickets service listening on port 3000!");
});
