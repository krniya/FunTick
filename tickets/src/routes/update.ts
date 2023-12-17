import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
    validateRequest,
    NotFoundError,
    requireAuth,
    NotAuthorizedError,
    BadRequestError,
} from "@kneeyaa/mshelper";
import { Ticket } from "../models/ticket";

const router = express.Router();

// * @desc        Update ticket details
// * @route       PUT /api/tickets/:id
// * @access      Private
router.put(
    "/api/tickets/:id",
    requireAuth,
    [
        body("title").not().isEmpty().withMessage("Title is required"),
        body("price")
            .isFloat({ gt: 0 })
            .withMessage("Price must be provided and must be greater than 0"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        // * Fetching ticket
        const ticket = await Ticket.findById(req.params.id);

        // * Ticket not found / wrong ticket id
        if (!ticket) {
            throw new NotFoundError();
        }

        // * Ticket already reserved
        if (ticket.orderId) {
            throw new BadRequestError("Cannot edit a reserved ticket");
        }

        // * Tring to edit others tickets
        if (ticket.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        // * Updating the ticket
        ticket.set({
            title: req.body.title,
            price: req.body.price,
        });
        await ticket.save();

        res.send(ticket);
    }
);

export { router as updateTicketRouter };
