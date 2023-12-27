import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns a 404 if the ticket is not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app).get(`/api/events/${id}`).send().expect(404);
});

it("returns the event if the ticket is found", async () => {
    const response = await request(app)
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

    const ticketResponse = await request(app)
        .get(`/api/events/${response.body.id}`)
        .send()
        .expect(200);

    expect(ticketResponse.body.title).toEqual("Test Event");
    expect(ticketResponse.body.price).toEqual("10");
});
