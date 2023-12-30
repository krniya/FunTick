import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const localSignUp = async (email: string) => {
    //* Test Credentials
    const firstName = "Test";
    const lastName = "User";
    const password = "Password";

    const response = await request(app)
        .post("/api/users/signup")
        .send({
            firstName,
            lastName,
            email,
            password,
        })
        .expect(201);
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

it("should return 200 status when sucessfully deleted the user", async () => {
    const { id, cookie } = await localSignUp("test@test.com");
    const res = await request(app).delete(`/api/users/${id}`).set("Cookie", cookie);
});

it("should return 401 status when trying to deleted other user", async () => {
    const { id, cookie } = await localSignUp("test@test.com");
    const res = await request(app)
        .delete(`/api/users/5f5b689c8f3dbc1de053d5d5`)
        .set("Cookie", cookie)
        .expect(401);
});
