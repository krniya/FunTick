import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";
import { Event } from "../../models/event";

it("returns an error if the event does not exist", async () => {
    const eventId = new mongoose.Types.ObjectId();

    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin())
        .send({ eventId })
        .expect(404);
});

it("returns an error if the event is already reserved", async () => {
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
    const order = Order.build({
        user: { _id: "5f5b689c8f3dbc1de053d5d5", firstName: "Test", lastName: "User" },
        status: OrderStatus.Created,
        expiresAt: new Date("2025-01-01T15:00:00Z"),
        event: { _id: event.id, title: event.title, price: event.price },
    });
    await order.save();

    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin())
        .send({ eventId: event.id })
        .expect(400);
});

it("reserves a event", async () => {
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

    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin())
        .send({ eventId: event.id })
        .expect(201);
});

it("emits an order created event", async () => {
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

    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin())
        .send({ eventId: event.id })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
