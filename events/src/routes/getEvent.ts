import express, { Request, Response } from "express";
import { NotFoundError } from "@kneeyaa/mshelper";
import { Event } from "../models/event";

const router = express.Router();

// * @desc        get event details
// * @route       GET /api/events/:id
// * @access      Public
router.get("/api/events/:id", async (req: Request, res: Response) => {
    // * Fetching event
    const event = await Event.findById(req.params.id);

    // * Event not found / wrong event id
    if (!event) {
        throw new NotFoundError();
    }

    res.send(event);
});

export { router as showEventRouter };
