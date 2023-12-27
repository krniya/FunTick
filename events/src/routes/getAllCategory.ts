import express, { Request, Response } from "express";
import { Category } from "../models/category";

const router = express.Router();

router.get("/api/events/category", async (req: Request, res: Response) => {
    try {
        console.log(
            "🚀 ~ file: getAllCategory.ts:10 ~ router.get ~ categories: Fetching all categories"
        );
        // * Fetching all categories
        const categories = await Category.find({});
        console.log("🚀 ~ file: getAllCategory.ts:10 ~ router.get ~ categories:", categories);

        // * Sending a response with the categories
        res.status(200).send(categories);
    } catch (error) {
        // * Handling errors
        console.error("Error fetching categories:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

export { router as getCategoriesRouter };
