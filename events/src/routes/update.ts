import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
    validateRequest,
    NotFoundError,
    requireAuth,
    NotAuthorizedError,
    BadRequestError,
} from "@kneeyaa/mshelper";
import { Event } from "../models/event";
import { EventUpdatedPublisher } from "../events/publishers/event-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

// * @desc        Update event details
// * @route       PUT /api/events/:id
// * @access      Private
router.put(
    "/api/events/:id",
    requireAuth,
    [
        body("title").not().isEmpty().withMessage("Title is required"),
        body("price")
            .isFloat({ gt: 0 })
            .withMessage("Price must be provided and must be greater than 0"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        // * Fetching event
        const event = await Event.findById(req.params.id);

        // * Event not found / wrong event id
        if (!event) {
            throw new NotFoundError();
        }

        // * Event already reserved
        if (event.orderId) {
            throw new BadRequestError("Cannot edit a reserved event");
        }

        // * Trying to edit others events
        if (event.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        // * Updating the event
        event.set({
            title: req.body.title,
            price: req.body.price,
        });
        await event.save();

        // * Event Update event published
        new EventUpdatedPublisher(natsWrapper.client).publish({
            id: event.id,
            title: event.title,
            price: event.price,
            userId: event.userId,
            version: event.version,
        });

        res.send(event);
    }
);

export { router as updateEventRouter };
