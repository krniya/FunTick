import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent } from "@kneeyaa/mshelper";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Event } from "../../../models/event";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = { _id: new mongoose.Types.ObjectId().toHexString() };
    const event = Event.build({
        title: "Test Event",
        description: "This is a test event",
        location: "Test Location",
        createdAt: new Date("2023-01-01T00:00:00Z"),
        imageUrl: "https://example.com/image.jpg",
        startDateTime: new Date("2023-01-01T12:00:00Z"),
        endDateTime: new Date("2023-01-01T15:00:00Z"),
        price: "10",
        isFree: false,
        url: "https://example.com/event",
        category: { _id: "5f5b689c8f3dbc1de053d5d5", name: "Test Category" },
        organizer: { _id: "5f5b689c8f3dbc1de053d5d5", firstName: "Test", lastName: "User" },
    });
    event.set({ order });
    await event.save();

    const data: OrderCancelledEvent["data"] = {
        id: order._id,
        version: 0,
        event: {
            id: event.id,
        },
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { msg, data, event, order, listener };
};

it("updates the event, publishes an event, and acks the message", async () => {
    const { msg, data, event, order, listener } = await setup();

    await listener.onMessage(data, msg);

    const updatedEvent = await Event.findById(event.id);
    expect(updatedEvent!.order).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
