import request from "supertest";
import { app } from "../../app";

it("should return 201 status when sucessfully signed up", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            firstName: "Test",
            lastName: "User",
            email: "test@test.com",
            password: "Password",
        })
        .expect(201);
});

it("should returns 400 status when no first name provided", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            lastName: "Test",
            email: "test@test.com",
            password: "Password",
        })
        .expect(400);
});

it("should returns 400 status when no last name provided", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            firstName: "User",
            email: "test@test.com",
            password: "Password",
        })
        .expect(400);
});

it("should returns 400 status when invalid or no email provided", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            firstName: "User",
            lastName: "Test",
            email: "test@test",
            password: "Password",
        })
        .expect(400);
});

it("should returns 400 status when invalid or no password is provided", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            firstName: "User",
            lastName: "Test",
            email: "test@test.com",
            password: "Pass",
        })
        .expect(400);
});

it("should disallows duplicate email", async () => {
    await global.signup();
    await request(app)
        .post("/api/users/signup")
        .send({
            firstName: "User",
            lastName: "Test",
            email: "test@test.com",
            password: "Password",
        })
        .expect(400);
});

it("should sets cookies after successful signup", async () => {
    const response = await request(app)
        .post("/api/users/signup")
        .send({
            firstName: "User",
            lastName: "Test",
            email: "test@test.com",
            password: "Password",
        })
        .expect(201);

    expect(response.get("Set-Cookie")).toBeDefined();
});
