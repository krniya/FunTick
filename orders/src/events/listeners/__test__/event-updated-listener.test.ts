import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { EventUpdatedEvent } from "@kneeyaa/mshelper";
import { EventUpdatedListener } from "../event-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Event } from "../../../models/event";

const setup = async () => {
    // * Create a listener
    const listener = new EventUpdatedListener(natsWrapper.client);

    // * Create and save a event
    const event = Event.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "Test Event",
        description: "This is a test event",
        location: "Test Location",
        createdAt: new Date(),
        imageUrl: "https://example.com/image.jpg",
        startDateTime: new Date("2023-01-01T12:00:00Z"),
        endDateTime: new Date("2023-01-01T15:00:00Z"),
        price: "10",
        isFree: false,
        url: "https://example.com/event",
        organizer: { _id: "5f5b689c8f3dbc1de053d5d5", firstName: "Test", lastName: "User" },
        category: { _id: "5f5b689c8f3dbc1de053d5d5", name: "Test Category" },
    });
    await event.save();

    // * Create a fake data object
    const data: EventUpdatedEvent["data"] = {
        id: event.id,
        title: event.title,
        description: event.description,
        location: event.location,
        createdAt: event.createdAt,
        imageUrl: event.imageUrl,
        startDateTime: event.startDateTime,
        endDateTime: event.endDateTime,
        price: event.price,
        isFree: event.isFree,
        url: event.url,
        organizer: event.organizer,
        category: event.category,
        version: event.version + 1,
    };

    // * Create a fake msg object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    // * return all of this stuff
    return { msg, data, event, listener };
};

it("finds, updates, and saves a event", async () => {
    const { msg, data, event, listener } = await setup();

    await listener.onMessage(data, msg);

    const updatedEvent = await Event.findById(event.id);

    expect(updatedEvent!.title).toEqual(data.title);
    expect(updatedEvent!.price).toEqual(data.price);
    expect(updatedEvent!.version).toEqual(data.version);
});

it("acks the message", async () => {
    const { msg, data, listener } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version number", async () => {
    const { msg, data, listener, event } = await setup();

    data.version = 10;

    try {
        await listener.onMessage(data, msg);
    } catch (err) {}

    expect(msg.ack).not.toHaveBeenCalled();
});
