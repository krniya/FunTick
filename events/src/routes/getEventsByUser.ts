import express, { Request, Response } from "express";
import { NotAuthorizedError, NotFoundError, requireAuth } from "@kneeyaa/mshelper";
import { Event } from "../models/event";

const router = express.Router();

// * @desc        get event by userid
// * @route       GET /api/events/user/:userId?page=#
// * @access      Private
router.get("/api/events/user/:userId", requireAuth, async (req: Request, res: Response) => {
    const limit = 6;
    const page = Number(req.query.page) || 1;
    const skipAmount = (page - 1) * limit;
    // * Trying to access other's events
    if (req.params.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    const events = await Event.find({
        "organizer._id": req.params.userId,
    })
        .sort({ createdAt: "desc" })
        .skip(skipAmount)
        .limit(limit);

    res.status(200).send(events);
});

export { router as getEventByUserIdRouter };
