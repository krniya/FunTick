import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Event } from "../../models/event";

it("fetches the order", async () => {
    //* Create a event
    const event = Event.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "Test Event",
        description: "This is a test event",
        location: "Test Location",
        createdAt: new Date(),
        imageUrl: "https://*example.com/image.jpg",
        startDateTime: new Date("2023-01-01T12:00:00Z"),
        endDateTime: new Date("2023-01-01T15:00:00Z"),
        price: "10",
        isFree: false,
        url: "https://*example.com/event",
        organizer: { _id: "5f5b689c8f3dbc1de053d5d5", firstName: "Test", lastName: "User" },
        category: { _id: "5f5b689c8f3dbc1de053d5d5", name: "Test Category" },
    });
    await event.save();

    const user = global.signin();
    //* make a request to build an order with this event
    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({ eventId: event.id })
        .expect(201);

    //* make request to fetch the order
    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .send()
        .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
});

it("returns an error if one user tries to fetch another users order", async () => {
    //* Create a event
    const event = Event.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "Test Event",
        description: "This is a test event",
        location: "Test Location",
        createdAt: new Date(),
        imageUrl: "https://*example.com/image.jpg",
        startDateTime: new Date("2023-01-01T12:00:00Z"),
        endDateTime: new Date("2023-01-01T15:00:00Z"),
        price: "10",
        isFree: false,
        url: "https://*example.com/event",
        organizer: { _id: "5f5b689c8f3dbc1de053d5d5", firstName: "Test", lastName: "User" },
        category: { _id: "5f5b689c8f3dbc1de053d5d5", name: "Test Category" },
    });
    await event.save();

    const user = global.signin();
    //* make a request to build an order with this event
    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({ eventId: event.id })
        .expect(201);

    //* make request to fetch the order
    await request(app)
        .get(`/api/orders/${order.id}`)
        .set("Cookie", global.randomSignin())
        .send()
        .expect(401);
});
