import mongoose from "mongoose";
import request from "supertest";
import { OrderStatus } from "@kneeyaa/mshelper";
import { app } from "../../app";
import { Order } from "../../models/order";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

it("returns a 404 when purchasing an order that does not exist", async () => {
    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin())
        .send({
            token: "token",
            orderId: new mongoose.Types.ObjectId().toHexString(),
        })
        .expect(404);
});

it("returns a 401 when purchasing an order that doesnt belong to the user", async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        user: { _id: "5f5b689c8f3dbc1de053d5d5", firstName: "Test", lastName: "User" },
        createdAt: new Date(),
        status: OrderStatus.Created,
        expiresAt: new Date("2025-01-01T15:00:00Z"),
        event: { _id: "5f5b689c8f3dbc1de053d5e5", title: "Test Title", price: "20" },
    });
    await order.save();

    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin())
        .send({
            token: "asldkfj",
            orderId: order.id,
        })
        .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        user: { _id: userId, firstName: "Test", lastName: "User" },
        createdAt: new Date(),
        status: OrderStatus.Created,
        expiresAt: new Date("2025-01-01T15:00:00Z"),
        event: { _id: "5f5b689c8f3dbc1de053d5e5", title: "Test Title", price: "20" },
    });
    await order.save();

    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin(userId))
        .send({
            orderId: order.id,
            token: "asdlkfj",
        })
        .expect(400);
});

it("returns a 201 with valid inputs", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const price = "10";
    const order = Order.build({
        id: "5f5b689c8f3dbc1de053d5e5",
        user: { _id: userId, firstName: "Test", lastName: "User" },
        createdAt: new Date(),
        status: OrderStatus.Created,
        expiresAt: new Date("2025-01-01T15:00:00Z"),
        event: { _id: "5f5b689c8f3dbc1de053d5e5", title: "Test Title", price: price },
    });
    await order.save();

    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin(userId))
        .send({
            token: "tok_visa",
            orderId: order.id,
        })
        .expect(201);

    const stripeCharges = await stripe.checkout.sessions.list();
    const stripeCharge = stripeCharges.data.find((charge: any) => {
        return charge.amount_total === parseInt(price) * 100;
    });

    expect(stripeCharge).toBeDefined();
    expect(stripeCharge!.currency).toEqual("usd");

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge!.id,
    });
    console.log(payment);
    expect(payment).not.toBeNull();
}, 30000);
