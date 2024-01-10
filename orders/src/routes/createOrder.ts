import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
    requireAuth,
    validateRequest,
    NotFoundError,
    OrderStatus,
    BadRequestError,
    NotAuthorizedError,
} from "@kneeyaa/mshelper";
import { body } from "express-validator";
import { Event } from "../models/event";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60; // * Event expiration time

// * @desc        Create new order
// * @route       POST /api/orders
// * @access      Private
router.post(
    "/api/orders",
    requireAuth,
    [
        body("eventId")
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage("EventId must be provided"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { eventId } = req.body;

        // * Find the event the user is trying to order in the database
        const event = await Event.findById(eventId);
        console.log("🚀 ~ event:", event);
        if (!event) {
            throw new NotFoundError();
        }

        // * Make sure that this event is not already reserved
        const isReserved = await event.isReserved();
        if (isReserved) {
            throw new BadRequestError("Event is already reserved");
        }

        // * Calculate an expiration date for this order
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

        // * Build the order and save it to the database
        const order = Order.build({
            user: {
                _id: req.currentUser?.id,
                firstName: req.currentUser?.firstName,
                lastName: req.currentUser?.lastName,
            },
            status: OrderStatus.Created,
            expiresAt: expiration,
            event: {
                _id: event.id,
                title: event.title,
                price: event.price,
            },
        });
        await order.save();

        // * Publish an event saying that an order was created
        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            createdAt: order.createdAt,
            event: order.event,
            buyer: {
                _id: order.user._id,
                firstName: order.user.firstName,
                lastName: order.user.lastName,
            },
            expiresAt: order.expiresAt,
        });

        res.status(201).send(order);
    }
);

export { router as newOrderRouter };
