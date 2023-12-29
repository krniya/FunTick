import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest, currentUser } from "@kneeyaa/mshelper";
import { Event } from "../models/event";
import { EventCreatedPublisher } from "../events/publishers/event-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

// * @desc        Create new event
// * @route       POST /api/events
// * @access      Private
router.post(
    "/api/events",
    requireAuth,
    [body("title").not().isEmpty().withMessage("Title is required")],
    [body("category").not().isEmpty().withMessage("Category is required")],
    [body("description").not().isEmpty().withMessage("Description is required")],
    [body("imageUrl").not().isEmpty().withMessage("Provide valid image Url")],
    [body("location").not().isEmpty().withMessage("Location is required")],
    [body("startDateTime").isISO8601().toDate().withMessage("Invalid startDateTime format")],
    [body("endDateTime").isISO8601().toDate().withMessage("Invalid endDateTime format")],
    [body("price").not().isEmpty().withMessage("Price is required")],
    [body("isFree").not().isEmpty().withMessage("isFree is required")],
    [body("url").not().isEmpty().withMessage("Url is required")],
    validateRequest,
    async (req: Request, res: Response) => {
        const {
            title,
            category,
            description,
            imageUrl,
            location,
            startDateTime,
            endDateTime,
            price,
            isFree,
            url,
        } = req.body;

        const createdAt = new Date();
        const organizer = {
            _id: req.currentUser!.id,
            firstName: req.currentUser!.firstName,
            lastName: req.currentUser!.lastName,
        };

        //* Creating new event
        const event = Event.build({
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
            category,
            organizer,
        });
        await event.save();

        //* Event creation event published
        new EventCreatedPublisher(natsWrapper.client).publish({
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
            category: event.category,
            organizer: event.organizer,
            version: event.version,
        });

        res.status(201).send(event);
    }
);

export { router as createEventRouter };
