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
        category: "5f5b689c8f3dbc1de053d5d5",
        organizer: "5f5b689c8f3dbc1de053d5d6",
    });
    await event.save();

    //* Create the fake data event
    const data: OrderCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: "5f5b689c8f3dbc1de053d5d6",
        expiresAt: "alskdjf",
        event: {
            id: event.id,
            price: parseInt(event.price),
        },
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, event, data, msg };
};

it("sets the order id of the event", async () => {
    const { listener, event, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedEvent = await Event.findById(event.id);

    expect(updatedEvent!.order).toEqual(data.id);
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
    console.log({
        eventdata: eventUpdatedData,
    });
    expect(data.id).toEqual(eventUpdatedData.order);
});
