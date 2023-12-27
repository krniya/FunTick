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
    [body("title").not().isEmpty().withMessage("Title is required")],
    [body("description").not().isEmpty().withMessage("Description is required")],
    [body("location").not().isEmpty().withMessage("Location is required")],
    [body("createdAt").not().isEmpty().withMessage("CreatedAt is required")],
    [body("imageUrl").not().isEmpty().withMessage("ImageURL is required")],
    [body("startDateTime").not().isEmpty().withMessage("startDateTime is required")],
    [body("endDateTime").not().isEmpty().withMessage("EndDateTime is required")],
    [body("price").not().isEmpty().withMessage("Price is required")],
    [body("isFree").not().isEmpty().withMessage("isFree is required")],
    [body("url").not().isEmpty().withMessage("Url is required")],
    [body("category").not().isEmpty().withMessage("Category is required")],
    validateRequest,
    async (req: Request, res: Response) => {
        // * Fetching event
        const event = await Event.findById(req.params.id);

        // * Event not found / wrong event id
        if (!event) {
            throw new NotFoundError();
        }

        // * Event already reserved
        if (event.order) {
            throw new BadRequestError("Cannot edit a reserved event");
        }
        // * Trying to edit others events
        if (event.organizer.toString() !== req.currentUser!.id) {
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
            location: event.location,
            createdAt: event.createdAt,
            imageUrl: event.imageUrl,
            startDateTime: event.startDateTime,
            endDateTime: event.endDateTime,
            price: event.price,
            isFree: event.isFree,
            url: event.url,
            category: event.category,
            organizer: event.organizer,
        });

        res.send(event);
    }
);

export { router as updateEventRouter };
