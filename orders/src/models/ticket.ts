import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order, OrderStatus } from "./order";

//* An interface that describes the properties
//* that are required to create a new Ticket
interface TicketAttrs {
    id: string;
    title: string;
    price: number;
}

//* An interface that describes the properties
//* that a ticket document model has
export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>;
}

//* An interface that describes the properties
//* that a Ticket model has
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(event: { id: string; version: number }): Promise<TicketDoc | null>;
}

//* Order Schema
//* {title, price, toJSON()}
const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
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

//* Version updation of tickets
ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

//* Function to find ticket by events.
ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1,
    });
};

//* Function to create new Ticket.
//* using it instead of 'new Ticket' to add type check
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price,
    });
};

ticketSchema.methods.isReserved = async function () {
    // * this === the ticket document that we just called 'isReserved' on
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete],
        },
    });

    return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
