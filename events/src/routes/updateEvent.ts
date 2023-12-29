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
    [body("category").not().isEmpty().withMessage("Category is required")],
    [body("description").not().isEmpty().withMessage("Description is required")],
    [body("imageUrl").isURL().withMessage("Provide valid image Url")],
    [body("location").not().isEmpty().withMessage("Location is required")],
    [
        body("startDateTime")
            .optional()
            .isISO8601()
            .toDate()
            .withMessage("Invalid startDateTime format"),
    ],
    [body("endDateTime").optional().isISO8601().toDate().withMessage("Invalid endDateTime format")],
    [body("price").not().isEmpty().withMessage("Price is required")],
    [body("isFree").not().isEmpty().withMessage("isFree is required")],
    [body("url").not().isEmpty().withMessage("Url is required")],
    validateRequest,
    async (req: Request, res: Response) => {
        // * Fetching data for updated events
        const {
            title,
            category,
            description,
            imageUrl,
            location,
            createdAt,
            startDateTime,
            endDateTime,
            price,
            isFree,
            url,
            order,
            organizer,
        } = req.body;
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
        if (event.organizer._id.toString() !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        // * Updating the event
        event.set({
            title,
            description,
            location,
            createdAt,
            imageUrl,
            startDateTime,
            endDateTime,
            price,
            isFree,
            url,
            order,
            category,
            organizer,
        });
        await event.save();

        // * Event Update event published
        new EventUpdatedPublisher(natsWrapper.client).publish({
            id: event.id,
            title: event.title,
            description: event.description,
            location: event.location,
            createdAt: event.createdAt,
            imageUrl: event.imageUrl,
            startDateTime: event.startDateTime,
            endDateTime: event.endDateTime,
            price: event.price,
            isFree: event.isFree,
            url: event.url,
            order: event.order,
            category: event.category,
            organizer: event.organizer,
            version: event.version,
        });

        res.send(event);
    }
);

export { router as updateEventRouter };
