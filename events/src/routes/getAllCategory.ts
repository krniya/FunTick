import express, { Request, Response } from "express";
import { Category } from "../models/category";

const router = express.Router();

router.get("/api/events/category/", async (req: Request, res: Response) => {
    try {
        // * Fetching all categories
        const category = await Category.find({});

        // * Sending a response with the categories
        res.status(200).send(category);
    } catch (error) {
        // * Handling errors
        console.error("Error fetching categories:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

export { router as getCategoriesRouter };
