import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Event } from "../../models/event";

const buildEvent = async () => {
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

    return event;
};

it("fetches orders for an particular user", async () => {
    // *  Create three events
    const eventOne = await buildEvent();
    const eventTwo = await buildEvent();
    const eventThree = await buildEvent();

    const userOne = global.randomSignin();
    const userTwo = global.signin();
    // *  Create one order as User #1
    await request(app)
        .post("/api/orders")
        .set("Cookie", userOne)
        .send({ eventId: eventOne.id })
        .expect(201);

    // *  Create two orders as User #2
    const { body: orderOne } = await request(app)
        .post("/api/orders")
        .set("Cookie", userTwo)
        .send({ eventId: eventTwo.id })
        .expect(201);
    const { body: orderTwo } = await request(app)
        .post("/api/orders")
        .set("Cookie", userTwo)
        .send({ eventId: eventThree.id })
        .expect(201);

    // *  Make request to get orders for User #2
    const response = await request(app).get("/api/orders").set("Cookie", userTwo).expect(200);

    // *  Make sure we only got the orders for User #2
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
    expect(response.body[0].event.id).toEqual(eventTwo.id);
    expect(response.body[1].event.id).toEqual(eventThree.id);
});
