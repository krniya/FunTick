import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@kneeyaa/mshelper";
import { Category } from "../models/category";

const router = express.Router();

// * @desc        Create new event category
// * @route       POST /api/events/category
// * @access      Private
router.post(
    "/api/events/category",
    requireAuth,
    [body("name").not().isEmpty().withMessage("Category name is required")],
    validateRequest,
    async (req: Request, res: Response) => {
        const { name } = req.body;

        //* Creating new event
        const category = Category.build({
            name,
        });
        await category.save();
        res.status(201).send(category);
    }
);

export { router as createCategoryRouter };
