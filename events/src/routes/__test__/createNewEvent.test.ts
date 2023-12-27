import request from "supertest";
import { app } from "../../app";
import { Event } from "../../models/event";

it("has a route handler listening to /api/events for post requests", async () => {
    const response = await request(app).post("/api/events").send({});

    expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
    await request(app).post("/api/events").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
    const response = await request(app).post("/api/events").set("Cookie", global.signin()).send({});

    expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
    await request(app)
        .post("/api/events")
        .set("Cookie", global.signin())
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
});

it("returns an error if an invalid description is provided", async () => {
    await request(app)
        .post("/api/events")
        .set("Cookie", global.signin())
        .send({
            title: "Test Event",
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

it("creates a event with valid inputs", async () => {
    let events = await Event.find({});
    expect(events.length).toEqual(0);

    await request(app)
        .post("/api/events")
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
        .expect(201);

    events = await Event.find({});
    expect(events.length).toEqual(1);
    expect(events[0].price).toEqual("10");
    expect(events[0].title).toEqual("Test Event");
});
