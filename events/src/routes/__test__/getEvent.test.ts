import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns a 404 if the event is not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app).get(`/api/events/${id}`).send().expect(404);
});

it("returns the event if found", async () => {
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
    const ticketResponse = await request(app)
        .get(`/api/events/${response.body.id}`)
        .send()
        .expect(200);

    console.log(response.body);
    expect(ticketResponse.body.title).toEqual("Test Event");
    expect(ticketResponse.body.price).toEqual("10");
    expect(ticketResponse.body.organizer.firstName).toEqual("Test");
});
