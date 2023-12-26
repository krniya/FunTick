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
    [
        body("title").not().isEmpty().withMessage("Title is required"),
        body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;

        //* Creating new event
        const event = Event.build({
            title,
            price,
            userId: req.currentUser!.id,
        });
        await event.save();

        //* event Created Event published
        new EventCreatedPublisher(natsWrapper.client).publish({
            id: event.id,
            title: event.title,
            price: event.price,
            userId: event.userId,
            version: event.version,
        });

        res.status(201).send(event);
    }
);

export { router as createEventRouter };
