import request from "supertest";
import { app } from "../../app";
import { Category } from "../../models/category";

it("has a route handler listening to /api/events/category for post requests", async () => {
    const response = await request(app).post("/api/events/category").send({});

    expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
    await request(app).post("/api/events/category").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
    const response = await request(app)
        .post("/api/events/category")
        .set("Cookie", global.signin())
        .send({});

    expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid name or no name is provided", async () => {
    await request(app)
        .post("/api/events/category")
        .set("Cookie", global.signin())
        .send({})
        .expect(400);
});

it("creates a category with valid inputs", async () => {
    const name = "concert";

    await request(app)
        .post("/api/events/category")
        .set("Cookie", global.signin())
        .send({
            name,
        })
        .expect(201);

    const category = await Category.find({});
    expect(category.length).toEqual(1);
    expect(category[0].name).toEqual(name);
});
