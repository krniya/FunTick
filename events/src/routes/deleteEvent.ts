import express, { Request, Response } from "express";
import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth } from "@kneeyaa/mshelper";
import { Event } from "../models/event";

const router = express.Router();

// * @desc        Delete event
// * @route       DELETE /api/events/:id
// * @access      Private
router.delete("/api/events/:id", requireAuth, async (req: Request, res: Response) => {
    // * Fetching event
    const event = await Event.findById(req.params.id);
    // * Event not found / wrong event id
    if (!event) {
        throw new NotFoundError();
    }
    // * Event already reserved
    if (event.order) {
        throw new BadRequestError("Cannot delete a reserved event");
    }
    // * Trying to edit others events
    if (event.organizer._id.toString() !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: `${event.id} - ${event.title} - Successfully deleted` });
});

export { router as deleteEventRouter };
