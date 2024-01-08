import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { EventCreatedEvent } from "@kneeyaa/mshelper";
import { EventCreatedListener } from "../event-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Event } from "../../../models/event";

const setup = async () => {
    // * create an instance of the listener
    const listener = new EventCreatedListener(natsWrapper.client);

    // * create a fake data event
    const data: EventCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId("659bbeb663fba66364871fc2").toHexString(),
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
        version: 0,
    };

    // * create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg };
};

it("creates and saves a event", async () => {
    const { listener, data, msg } = await setup();

    //*  call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);
    //*  write assertions to make sure a event was created!
    const event = await Event.findById(data.id);

    expect(event).toBeDefined();
    expect(event!.title).toEqual(data.title);
    expect(event!.price).toEqual(data.price);
});

it("acks the message", async () => {
    const { data, listener, msg } = await setup();

    // * call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // * write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});
