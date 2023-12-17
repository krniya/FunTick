import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

// * @desc        Get all the tickets
// * @route       GET /api/tickets
// * @access      Public
router.get("/api/tickets", async (req: Request, res: Response) => {
    // * Fetching ticket which are not ordered
    const tickets = await Ticket.find({
        orderId: undefined,
    });

    res.send(tickets);
});

export { router as indexTicketRouter };
