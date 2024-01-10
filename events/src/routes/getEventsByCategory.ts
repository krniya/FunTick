import express, { Request, Response } from "express";
import { NotAuthorizedError, NotFoundError, requireAuth } from "@kneeyaa/mshelper";
import { Event } from "../models/event";
import { ObjectId } from "mongodb";

const router = express.Router();

// * @desc        get event by category
// * @route       GET /api/events/category/:id?page=#
// * @access      Public
router.get("/api/events/category/:id", async (req: Request, res: Response) => {
    const limit = 6;
    const page = Number(req.query.page) || 1;
    const skipAmount = (page - 1) * limit;

    const events = await Event.find({ "category._id": req.params.id })
        .sort({ createdAt: "desc" })
        .skip(skipAmount)
        .limit(limit);
    res.status(200).send(events);
});

export { router as getEventByCategorydRouter };
