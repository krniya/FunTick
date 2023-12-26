import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@kneeyaa/mshelper";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Event } from "../../../models/event";

const setup = async () => {
    //* Create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    //* Create and save a event
    const event = Event.build({
        title: "concert",
        price: 99,
        userId: "asdf",
    });
    await event.save();

    //* Create the fake data event
    const data: OrderCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: "alskdfj",
        expiresAt: "alskdjf",
        event: {
            id: event.id,
            price: event.price,
        },
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, event, data, msg };
};

it("sets the userId of the event", async () => {
    const { listener, event, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedEvent = await Event.findById(event.id);

    expect(updatedEvent!.userId).toEqual(data.id);
});

it("acks the message", async () => {
    const { listener, event, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it("publishes a event updated event", async () => {
    const { listener, event, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(data.id).toEqual(eventUpdatedData.orderId);
});
