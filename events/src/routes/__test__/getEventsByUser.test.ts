import request from "supertest";
import { app } from "../../app";

const createEvent = async (title: string, cookie: any) => {
    await request(app)
        .post("/api/events")
        .set("Cookie", cookie)
        .send({
            title: title,
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

it("returns unauthorized error when trying to access other's events", async () => {
    const cookie = await global.signin();
    await createEvent("Test Event", cookie);
    const response = await request(app)
        .get(`/api/events/user/5f5b689c8f3dbc1de053d5d4`)
        .expect(401);
});

it("return events for a particular user", async () => {
    const cookie = await global.signin();
    await createEvent("Test Event 1", cookie);
    await createEvent("Test Event 2", cookie);
    await createEvent("Test Event 3", cookie);
    const response = await request(app).get(`/api/events/user/5f5b689c8f3dbc1de053d5d5`);
    // console.log("🚀 ~ file: getEventsByUser.test.ts:25 ~ it ~ response:", response.body);
    // console.log("🚀 ~ file: getEventsByUser.test.ts:25 ~ it ~ response:", response.error);
    expect(response.body.length).toEqual(3);
});
