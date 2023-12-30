import request from "supertest";
import { app } from "../../app";

// * Function to create dummy events
const createEvent = () => {
    return request(app)
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
        });
};

it("can fetch a list of first 6 events", async () => {
    await createEvent();
    await createEvent();
    await createEvent();
    await createEvent();
    await createEvent();
    await createEvent();
    await createEvent();

    const response = await request(app).get("/api/events?page=1").send();
    expect(response.body.length).toEqual(6);
});
