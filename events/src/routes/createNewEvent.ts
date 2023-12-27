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
        const {
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
        } = req.body;

        const organizer = req.currentUser!.id;
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

        res.status(201).send(event);
    }
);

export { router as createEventRouter };
