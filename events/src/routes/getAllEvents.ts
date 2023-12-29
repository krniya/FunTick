import express, { Request, Response } from "express";
import { Event } from "../models/event";

const router = express.Router();

// * @desc        Get all the events
// * @route       GET /api/events
// * @access      Public
router.get("/api/events", async (req: Request, res: Response) => {
    // * Fetching event which are not ordered
    const events = await Event.find({
        order: undefined,
    });

    res.send(events);
});

export { router as indexEventRouter };
