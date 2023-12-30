import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Event } from "../../models/event";

it("returns a 404 if the provided id does not exist", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .delete(`/api/events/${id}`)
        .set("Cookie", global.randomSignin())
        .send()
        .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
    const response = await request(app)
        .post("/api/events")
        .set("Cookie", global.signin())
        .send({
            title: "Test Event",
            description: "This is a test event",
            location: "Test Location",
            imageUrl: "https://example.com/image.jpg",
            startDateTime: new Date("2023-01-01T12:00:00Z"),
            endDateTime: new Date("2023-01-01T15:00:00Z"),
            price: "10",
            isFree: false,
            url: "https://example.com/event",
            category: { _id: "5f5b689c8f3dbc1de053d5d5", name: "Test Category" },
        })
        .expect(201);
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .delete(`/api/events/${response.body.id}`)
        .set("Cookie", global.randomSignin())
        .expect(401);
});

it("returns a 401 if the user does not own the event", async () => {
    const response = await request(app)
        .post("/api/events")
        .set("Cookie", global.signin())
        .send({
            title: "Test Event",
            description: "This is a test event",
            location: "Test Location",
            imageUrl: "https://example.com/image.jpg",
            startDateTime: new Date("2023-01-01T12:00:00Z"),
            endDateTime: new Date("2023-01-01T15:00:00Z"),
            price: "10",
            isFree: false,
            url: "https://example.com/event",
            category: { _id: "5f5b689c8f3dbc1de053d5d5", name: "Test Category" },
        })
        .expect(201);
    await request(app)
        .delete(`/api/events/${response.body.id}`)
        .set("Cookie", global.randomSignin())
        .expect(401);
});

it("delete the event if all correct", async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post("/api/events")
        .set("Cookie", cookie)
        .send({
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
        });

    await request(app).delete(`/api/events/${response.body.id}`).set("Cookie", cookie);
    await request(app).get(`/api/events/${response.body.id}`).expect(404);
});

it("rejects updates if the event is reserved", async () => {
    const cookie = await global.signin();
    const response = await request(app)
        .post("/api/events")
        .set("Cookie", cookie)
        .send({
            title: "Test Event",
            description: "This is a test event",
            location: "Test Location",
            imageUrl: "https://example.com/image.jpg",
            startDateTime: new Date("2023-01-01T12:00:00Z"),
            endDateTime: new Date("2023-01-01T15:00:00Z"),
            price: "10",
            isFree: false,
            url: "https://example.com/event",
            category: { _id: "5f5b689c8f3dbc1de053d5d5", name: "Test Category" },
        })
        .expect(201);

    const event = await Event.findById(response.body.id);
    event!.set({ order: { _id: new mongoose.Types.ObjectId().toHexString() } });
    await event!.save();

    await request(app).delete(`/api/events/${response.body.id}`).set("Cookie", cookie).expect(400);
});
