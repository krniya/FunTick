import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";

//* Global signup function type declearation
declare global {
    namespace NodeJS {
        interface Global {
            signin(id?: string): string[];
        }
    }
}

//* Mock connection with NATS
jest.mock("../nats-wrapper");

process.env.STRIPE_KEY =
    "sk_test_51OMZkbSEnybCDlcervStR8CpBRQ458z1GyCL7BritzcGBfghFAQXM9uEnMnVUsQC5a2wh3BUlmd00bf37KrTIWmv00JeUirn1N";

let mongo: any;
//* Setting up test mongodb
beforeAll(async () => {
    process.env.JWT_KEY = "key";
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri);
});

//* Clearing data after each test execution
beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

//* Mongodb connection closed after
afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

//* Signin function to generate dummy cookie
global.signin = (id: string) => {
    // * Build a JWT payload.  { id, email }
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: "test@test.com",
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
