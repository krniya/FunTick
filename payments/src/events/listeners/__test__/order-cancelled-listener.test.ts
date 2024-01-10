import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderStatus, OrderCancelledEvent } from "@kneeyaa/mshelper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        user: { _id: "5f5b689c8f3dbc1de053d5e5", firstName: "Test", lastName: "User" },
        createdAt: new Date(),
        status: OrderStatus.Created,
        expiresAt: new Date("2025-01-01T15:00:00Z"),
        event: { _id: "5f5b689c8f3dbc1de053d5e5", title: "Test Title", price: "20" },
    });
    await order.save();

    const data: OrderCancelledEvent["data"] = {
        id: order.id,
        createdAt: order.createdAt,
        totalAmount: "10",
        event: order.event,
        buyer: order.user,
        version: 1,
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg, order };
};

it("updates the status of the order", async () => {
    const { listener, data, msg, order } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("acks the message", async () => {
    const { listener, data, msg, order } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});
