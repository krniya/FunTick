import request from "supertest";
import { app } from "../../app";

// * Function to create dummy events
const createEvent = () => {
    return request(app).post("/api/events").set("Cookie", global.signin()).send({
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
};

it("can fetch a list of events", async () => {
    await createEvent();
    await createEvent();
    await createEvent();

    const response = await request(app).get("/api/events").send().expect(200);
    expect(response.body.length).toEqual(3);
});