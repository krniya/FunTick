import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const localSignUp = async (email: string) => {
    //* Test Credentials
    const firstName = "Test";
    const lastName = "User";
    const password = "Password";

    const response = await request(app).post("/api/users/signup").send({
        firstName,
        lastName,
        email,
        password,
    });

    console.log("🚀 ~ file: updateUser.test.ts:13 ~ localSignUp ~ response:", response);
    const cookie = response.get("Set-Cookie");
    return { id: response.body.id, cookie };
};

const randomCookie = () => {
    // * Build a JWT payload.  { id, email }
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        firstName: "Test",
        lastName: "User",
    };

    // * Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // * Build session Object. { jwt: MY_JWT }
    const session = { jwt: token };

    // * Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // * Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString("base64");

    // * return a string thats the cookie with the encoded data
    return [`session=${base64}`];
};

it("should return 200 status when sucessfully update the user", async () => {
    const { id, cookie } = await localSignUp("test@test.com");
    const res = await request(app)
        .put(`/api/users/${id}`)
        .set("Cookie", cookie)
        .send({
            firstName: "UTest",
            lastName: "User",
            email: "utest@test.com",
            username: "testing",
            photo: "http://profile.com/pic",
        })
        .expect(200);
    expect(res.body.firstName).toEqual("UTest");
    expect(res.body.username).toEqual("testing");
});

it("should returns 400 status when no first name provided", async () => {
    const { id, cookie } = await localSignUp("test@test.com");
    await request(app)
        .put(`/api/users/${id}`)
        .set("Cookie", cookie)
        .send({
            lastName: "User",
            email: "utest@test.com",
            username: "testing",
            photo: "http://profile.com/pic",
        })
        .expect(400);
});

it("should returns 400 status when no last name provided", async () => {
    const { id, cookie } = await localSignUp("test@test.com");
    await request(app)
        .put(`/api/users/${id}`)
        .set("Cookie", cookie)
        .send({
            firstName: "User",
            email: "utest@test.com",
            username: "testing",
            photo: "http://profile.com/pic",
        })
        .expect(400);
});

it("should returns 400 status when invalid or no email provided", async () => {
    const { id, cookie } = await localSignUp("test@test.com");
    const res = await request(app)
        .put(`/api/users/${id}`)
        .set("Cookie", cookie)
        .send({
            lastName: "User",
            username: "testing",
            photo: "http://profile.com/pic",
        })
        .expect(400);
});

it("should sets updated cookies after successful changing details", async () => {
    const { id, cookie } = await localSignUp("test@test.com");
    const response = await request(app)
        .put(`/api/users/${id}`)
        .set("Cookie", cookie)
        .send({
            firstName: "UTest",
            lastName: "User",
            email: "utest@test.com",
            username: "testing",
            photo: "http://profile.com/pic",
        })
        .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();
});

it("should return 401 when trying to edit other's user details", async () => {
    const { id, cookie } = await localSignUp("test@test.com");
    const response = await request(app)
        .put(`/api/users/${id}`)
        .set("Cookie", randomCookie())
        .send({
            firstName: "UTest",
            lastName: "User",
            email: "utest@test.com",
            username: "testing",
            photo: "http://profile.com/pic",
        })
        .expect(401);
});

it("should return 400 status when new email already in use", async () => {
    await localSignUp("test@test.com");
    const resp = await localSignUp("test1@test.com");
    const nres = await request(app)
        .put(`/api/users/${resp.id}`)
        .set("Cookie", resp.cookie)
        .send({
            firstName: "UTest",
            lastName: "User",
            email: "test@test.com",
            username: "testing",
            photo: "http://profile.com/pic",
        })
        .expect(400);
});

it("should return 400 status when new username already in use", async () => {
    const { id, cookie } = await localSignUp("test@test.com");
    const res = await request(app).put(`/api/users/${id}`).set("Cookie", cookie).send({
        firstName: "UTest",
        lastName: "User",
        email: "ntest@test.com",
        username: "testing",
        photo: "http://profile.com/pic",
    });
    const resp = await localSignUp("test1@test.com");
    const nres = await request(app)
        .put(`/api/users/${resp.id}`)
        .set("Cookie", resp.cookie)
        .send({
            firstName: "UTest",
            lastName: "User",
            email: "test1@test.com",
            username: "testing",
            photo: "http://profile.com/pic",
        })
        .expect(400);
});
