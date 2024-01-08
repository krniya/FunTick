import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Event } from "../../models/event";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";

it("marks an order as cancelled", async () => {
    // *  create a event with Event Model
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

    const user = global.signin();
    // *  make a request to create an order
    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({ eventId: event.id })
        .expect(201);

    // *  make a request to cancel the order
    await request(app).delete(`/api/orders/${order.id}`).set("Cookie", user).send().expect(204);

    // *  expectation to make sure the thing is cancelled
    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits a order cancelled event", async () => {
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

    const user = global.signin();
    // *  make a request to create an order
    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({ eventId: event.id })
        .expect(201);

    // *  make a request to cancel the order
    const res = await request(app)
        .delete(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .send()
        .expect(204);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
