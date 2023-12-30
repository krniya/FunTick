import request from "supertest";
import { app } from "../../app";

it("should fails when wrong email is provided", async () => {
    return request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test1.com",
            password: "Password",
        })
        .expect(400);
});

it("should fails when wrong credentials is provided", async () => {
    await global.signup();
    return request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "Password1",
        })
        .expect(400);
});

it("should response with a cookie when valid credentials is provided", async () => {
    await global.signup();

    const response = await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "Password",
        })
        .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();
});
