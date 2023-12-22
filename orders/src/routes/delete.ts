import express, { Request, Response } from "express";
import { requireAuth, NotFoundError, NotAuthorizedError } from "@kneeyaa/mshelper";
import { Order, OrderStatus } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

// * @desc        Delete order
// * @route       DELETE /api/order/:orderId
// * @access      Private
router.delete("/api/orders/:orderId", requireAuth, async (req: Request, res: Response) => {
    const { orderId } = req.params;

    // * Fetching order by order id
    const order = await Order.findById(orderId).populate("ticket");

    // * If no order found / wrong order id provided
    if (!order) {
        throw new NotFoundError();
    }

    // * If unauthorized accessed
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    // * Changing order status
    order.status = OrderStatus.Cancelled;
    await order.save();

    // * publishing an event saying this was cancelled!
    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id,
        },
    });

    res.status(204).send(order);
});

export { router as deleteOrderRouter };
