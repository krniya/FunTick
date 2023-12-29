import express, { Request, Response } from "express";
import { NotAuthorizedError, NotFoundError, requireAuth } from "@kneeyaa/mshelper";
import { Event } from "../models/event";

const router = express.Router();

// * @desc        get event by userid
// * @route       GET /api/events/user/:userId
// * @access      Private
router.get("/api/events/user/:userId", requireAuth, async (req: Request, res: Response) => {
    console.log("🚀 ~ file: getEventsByUser.ts:14 ~ router.get ~ req:", req.currentUser?.id);
    console.log("🚀 ~ file: getEventsByUser.ts:14 ~ router.get ~ userId:", req.params.userId);
    // * Trying to access other's events
    if (req.params.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    const events = await Event.find({
        organizer: {
            _id: req.params.userId,
            firstName: req.currentUser?.firstName,
            lastName: req.currentUser?.lastName,
        },
    });

    res.status(200).send(events);
});

export { router as getEventByUserIdRouter };
