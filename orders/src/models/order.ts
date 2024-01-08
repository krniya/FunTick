import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@kneeyaa/mshelper";

export { OrderStatus };

//* An interface that describes the properties
//* that are required to create a new Order
interface OrderAttrs {
    user: { _id?: string; firstName?: string; lastName?: string };
    status: OrderStatus;
    expiresAt: Date;
    event: { _id: string; title: string; price: string };
}

//* An interface that describes the properties
//* that a order document model has
interface OrderDoc extends mongoose.Document {
    _id: string;
    user: { _id: string; firstName: string; lastName: string };
    status: OrderStatus;
    expiresAt: Date;
    event: { _id: string; title: string; price: string };
    createdAt: Date;
    stripeId: Date;
    version: number;
}

//* An interface that describes the properties
//* that a order model has
interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

//* Order Schema
//* {user, status, expiresAt, event, createdAt, toJSON()}
const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(OrderStatus),
            default: OrderStatus.Created,
        },
        expiresAt: {
            type: mongoose.Schema.Types.Date,
        },
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        stripeId: {
            type: String,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

//* Version updation of orders
orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

//* Function to create new order.
//* using it instead of 'new Order' to add type check
orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
