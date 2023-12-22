import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";
import { PaymentCreatedListener } from "./events/listeners/payment-created-listener";

//* MongoDB connection function
const startDBConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!); //* Path to mongodb services [kubernetes]
        console.log("Connected to Order MongoDB");
    } catch (err) {
        console.log(err);
    }
};

//* NATS connection function
const connectWithNATS = async () => {
    await natsWrapper.connect(
        process.env.NATS_CLUSTER_ID!,
        process.env.NATS_CLIENT_ID!,
        process.env.NATS_URL!
    );
    natsWrapper.client.on("close", () => {
        console.log("NATS connection closed!");
        process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    //* Event listner
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();
};

//* Environmnet variable defination check function
const envVariableCheck = () => {
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined");
    }
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI must be defined");
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error("NATS_CLIENT_ID must be defined");
    }
    if (!process.env.NATS_URL) {
        throw new Error("NATS_URL must be defined");
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error("NATS_CLUSTER_ID must be defined");
    }
};

//* Checking environment variable declearation
envVariableCheck();

//* Connecting to mongoDB
startDBConnection();

//* Connecting with NATS
connectWithNATS();

app.listen(3000, () => {
    console.log("Order service listening on port 3000!");
});
