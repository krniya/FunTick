import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

//* An interface that describes the properties
//* that are required to create a new Ticket
interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}

//* An interface that describes the properties
//* that a ticket document model has
interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
}

//* An interface that describes the properties
//* that a ticket model has
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

//* Ticket Schema
//* {ticket, price, userId, orderId, toJSON()}
const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        orderId: {
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

//* Version of tickets
ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

//* Function to create new ticket.
//* using it instead of 'new Ticket' to add type check
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
