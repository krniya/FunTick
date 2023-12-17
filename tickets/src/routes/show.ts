import express, { Request, Response } from "express";
import { NotFoundError } from "@kneeyaa/mshelper";
import { Ticket } from "../models/ticket";

const router = express.Router();

// * @desc        get ticket details
// * @route       GET /api/tickets/:id
// * @access      Public
router.get("/api/tickets/:id", async (req: Request, res: Response) => {
    // * Fetching ticket
    const ticket = await Ticket.findById(req.params.id);

    // * Ticket not found / wrong ticket id
    if (!ticket) {
        throw new NotFoundError();
    }

    res.send(ticket);
});

export { router as showTicketRouter };
