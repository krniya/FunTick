import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent } from "@kneeyaa/mshelper";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Event } from "../../../models/event";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();
    const event = Event.build({
        title: "concert",
        price: 20,
        userId: "asdf",
    });
    event.set({ orderId });
    await event.save();

    const data: OrderCancelledEvent["data"] = {
        id: orderId,
        version: 0,
        event: {
            id: event.id,
        },
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { msg, data, event, orderId, listener };
};

it("updates the event, publishes an event, and acks the message", async () => {
    const { msg, data, event, orderId, listener } = await setup();

    await listener.onMessage(data, msg);

    const updatedEvent = await Event.findById(event.id);
    expect(updatedEvent!.userId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
