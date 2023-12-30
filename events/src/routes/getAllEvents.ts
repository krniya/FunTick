import express, { Request, Response } from "express";
import { Event } from "../models/event";

const router = express.Router();

// * @desc        Get all the events
// * @route       GET /api/events/:page
// * @access      Public
router.get("/api/events", async (req: Request, res: Response) => {
    try {
        const limit = 6;
        const page = Number(req.query.page) || 1;
        const skipAmount = (page - 1) * limit;
        const events = await Event.find({})
            .sort({ createdAt: "desc" })
            .skip(skipAmount)
            .limit(limit);

        res.send(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

export { router as indexEventRouter };
