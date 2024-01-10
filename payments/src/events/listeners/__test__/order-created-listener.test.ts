import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCreatedEvent, OrderStatus } from "@kneeyaa/mshelper";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Order } from "../../../models/order";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const data: OrderCreatedEvent["data"] = {
        id: "5f5b689c8f3dbc1de053d5d5",
        createdAt: new Date(),
        totalAmount: "10",
        status: OrderStatus.Created,
        event: {
            _id: "5f5b689c8f3dbc1de053d5d5",
            title: "Test Title",
            price: "10",
        },
        buyer: {
            _id: "5f5b689c8f3dbc1de053d5d5",
            firstName: "Test",
            lastName: "User",
        },
        expiresAt: new Date(),
        version: 1,
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg };
};

it("replicates the order info", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);
    expect(order!.event._id.toString()).toEqual(data.event._id);
});

it("acks the message", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});
