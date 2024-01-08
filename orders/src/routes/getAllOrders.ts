import express, { Request, Response } from "express";
import { requireAuth } from "@kneeyaa/mshelper";
import { Order } from "../models/order";

const router = express.Router();

// * @desc        Get all the orders
// * @route       GET /api/orders
// * @access      Private
router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
    // * Find all the orders
    const orders = await Order.find({
        user: req.currentUser!.id,
    }).populate("event");

    res.send(orders);
});

export { router as indexOrderRouter };
