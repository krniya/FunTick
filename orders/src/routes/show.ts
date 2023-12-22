import express, { Request, Response } from "express";
import { requireAuth, NotFoundError, NotAuthorizedError } from "@kneeyaa/mshelper";
import { Order } from "../models/order";

const router = express.Router();

// * @desc        Get order by order id
// * @route       GET /api/order/:orderId
// * @access      Private
router.get("/api/orders/:orderId", requireAuth, async (req: Request, res: Response) => {
    // * Fetching order by order id
    const order = await Order.findById(req.params.orderId).populate("ticket");
    // * Order not found / wrong order id provided
    if (!order) {
        throw new NotFoundError();
    }
    // * Unauthorized edit
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    res.send(order);
});

export { router as showOrderRouter };
