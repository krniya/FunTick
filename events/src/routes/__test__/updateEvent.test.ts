import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Event } from "../../models/event";
import { randomBytes } from "crypto";

it("returns a 404 if the provided id does not exist", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/events/${id}`)
        .set("Cookie", global.signin())
        .send({
            title: "Test Event",
            description: "This is a test event",
            location: "Test Location",
            createdAt: "2023-01-01T00:00:00Z",
            imageUrl: "https://example.com/image.jpg",
            startDateTime: "2023-01-01T12:00:00Z",
            endDateTime: "2023-01-01T15:00:00Z",
            price: "10",
            isFree: false,
            url: "https://example.com/event",
            category: "5f5b689c8f3dbc1de053d5d5",
            organizer: "5f5b689c8f3dbc1de053d5d5",
        })
        .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/events/${id}`)
        .send({
            title: "Test Event",
            description: "This is a test event",
            location: "Test Location",
            createdAt: "2023-01-01T00:00:00Z",
            imageUrl: "https://example.com/image.jpg",
            startDateTime: "2023-01-01T12:00:00Z",
            endDateTime: "2023-01-01T15:00:00Z",
            price: "10",
            isFree: false,
            url: "https://example.com/event",
            category: "5f5b689c8f3dbc1de053d5d5",
            organizer: "5f5b689c8f3dbc1de053d5d5",
        })
        .expect(401);
});

it("returns a 401 if the user does not own the event", async () => {
    const response = await request(app).post("/api/events").set("Cookie", global.signin()).send({
        title: "Test Event",
        description: "This is a test event",
        location: "Test Location",
        createdAt: "2023-01-01T00:00:00Z",
        imageUrl: "https://example.com/image.jpg",
        startDateTime: "2023-01-01T12:00:00Z",
        endDateTime: "2023-01-01T15:00:00Z",
        price: "10",
        isFree: false,
        url: "https://example.com/event",
        category: "5f5b689c8f3dbc1de053d5d5",
    });

    const res = await request(app)
        .put(`/api/events/${response.body.id}`)
        .set("Cookie", global.randomSignin())
        .send({
            title: "Test Event",
            description: "This is a test event",
            location: "Test Location",
            createdAt: "2023-01-01T00:00:00Z",
            imageUrl: "https://example.com/image.jpg",
            startDateTime: "2023-01-01T12:00:00Z",
            endDateTime: "2023-01-01T15:00:00Z",
            price: "10",
            isFree: false,
            url: "https://example.com/event",
            category: "5f5b689c8f3dbc1de053d5d5",
        })
        .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
    const cookie = global.signin();

    const response = await request(app).post("/api/events").set("Cookie", cookie).send({
        title: "Test Event",
        description: "This is a test event",
        location: "Test Location",
        createdAt: "2023-01-01T00:00:00Z",
        imageUrl: "https://example.com/image.jpg",
        startDateTime: "2023-01-01T12:00:00Z",
        endDateTime: "2023-01-01T15:00:00Z",
        price: "10",
        isFree: false,
        url: "https://example.com/event",
        category: "5f5b689c8f3dbc1de053d5d5",
        organizer: "5f5b689c8f3dbc1de053d5d5",
    });

    await request(app)
        .put(`/api/events/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            description: "This is a test event",
            location: "Test Location",
            createdAt: "2023-01-01T00:00:00Z",
            imageUrl: "https://example.com/image.jpg",
            startDateTime: "2023-01-01T12:00:00Z",
            endDateTime: "2023-01-01T15:00:00Z",
            price: "10",
            isFree: false,
            url: "https://example.com/event",
            category: "5f5b689c8f3dbc1de053d5d5",
            organizer: "5f5b689c8f3dbc1de053d5d5",
        })
        .expect(400);

    await request(app)
        .put(`/api/events/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "Test Event",
            description: "This is a test event",
            location: "Test Location",
            createdAt: "2023-01-01T00:00:00Z",
            imageUrl: "https://example.com/image.jpg",
            startDateTime: "2023-01-01T12:00:00Z",
            endDateTime: "2023-01-01T15:00:00Z",
            isFree: false,
            url: "https://example.com/event",
            category: "5f5b689c8f3dbc1de053d5d5",
            organizer: "5f5b689c8f3dbc1de053d5d5",
        })
        .expect(400);
});

it("updates the event provided valid inputs", async () => {
    const cookie = global.signin();

    const response = await request(app).post("/api/events").set("Cookie", cookie).send({
        title: "Test Event",
        description: "This is a test event",
        location: "Test Location",
        createdAt: "2023-01-01T00:00:00Z",
        imageUrl: "https://example.com/image.jpg",
        startDateTime: "2023-01-01T12:00:00Z",
        endDateTime: "2023-01-01T15:00:00Z",
        price: "10",
        isFree: false,
        url: "https://example.com/event",
        category: "5f5b689c8f3dbc1de053d5d5",
        organizer: "5f5b689c8f3dbc1de053d5d5",
    });

    await request(app)
        .put(`/api/events/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "Test Event new",
            description: "This is a test event",
            location: "Test Location",
            createdAt: "2023-01-01T00:00:00Z",
            imageUrl: "https://example.com/image.jpg",
            startDateTime: "2023-01-01T12:00:00Z",
            endDateTime: "2023-01-01T15:00:00Z",
            price: "20",
            isFree: false,
            url: "https://example.com/event",
            category: "5f5b689c8f3dbc1de053d5d5",
            organizer: "5f5b689c8f3dbc1de053d5d5",
        })
        .expect(200);

    const eventResponse = await request(app).get(`/api/events/${response.body.id}`).send();

    expect(eventResponse.body.title).toEqual("Test Event new");
    expect(eventResponse.body.price).toEqual("20");
});

it("rejects updates if the event is reserved", async () => {
    const cookie = global.signin();
    const response = await request(app).post("/api/events").set("Cookie", cookie).send({
        title: "Test Event",
        description: "This is a test event",
        location: "Test Location",
        createdAt: "2023-01-01T00:00:00Z",
        imageUrl: "https://example.com/image.jpg",
        startDateTime: "2023-01-01T12:00:00Z",
        endDateTime: "2023-01-01T15:00:00Z",
        price: "10",
        isFree: false,
        url: "https://example.com/event",
        category: "5f5b689c8f3dbc1de053d5d5",
        organizer: "5f5b689c8f3dbc1de053d5d5",
    });

    const event = await Event.findById(response.body.id);
    event!.set({ order: new mongoose.Types.ObjectId().toHexString() });
    await event!.save();

    await request(app)
        .put(`/api/events/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "Test Event new",
            description: "This is a test event",
            location: "Test Location",
            createdAt: "2023-01-01T00:00:00Z",
            imageUrl: "https://example.com/image.jpg",
            startDateTime: "2023-01-01T12:00:00Z",
            endDateTime: "2023-01-01T15:00:00Z",
            price: "10",
            isFree: false,
            url: "https://example.com/event",
            category: "5f5b689c8f3dbc1de053d5d5",
            organizer: "5f5b689c8f3dbc1de053d5d5",
        })
        .expect(400);
});
