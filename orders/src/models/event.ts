import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order, OrderStatus } from "./order";

//* An interface that describes the properties
//* that are required to create a new Event
interface EventAttrs {
    id: string;
    title: string;
    description?: string;
    location?: string;
    createdAt: Date;
    imageUrl: string;
    startDateTime: Date;
    endDateTime: Date;
    price: string;
    isFree: boolean;
    url?: string;
    order?: { _id: string };
    category: { _id: string; name: string };
    organizer: { _id: string; firstName: string; lastName: string };
}

//* An interface that describes the properties
//* that a Event document model has
interface EventDoc extends mongoose.Document {
    _id: string;
    title: string;
    description?: string;
    location?: string;
    createdAt: Date;
    imageUrl: string;
    startDateTime: Date;
    endDateTime: Date;
    price: string;
    isFree: boolean;
    url?: string;
    order?: { _id: string };
    category: { _id: string; name: string };
    organizer: { _id: string; firstName: string; lastName: string };
    version: number;
    isReserved(): Promise<boolean>;
}

//* An interface that describes the properties
//* that a Event model has
interface EventModel extends mongoose.Model<EventDoc> {
    build(attrs: EventAttrs): EventDoc;
    findByEvent(event: { id: string; version: number }): Promise<EventDoc | null>;
}

//* Event Schema
//* {title, description, location, createdAt, imageUrl, startDateTime, endDateTime, price, isFree, url, category, organizer, toJSON()}
const eventSchema = new mongoose.Schema(
    {
        title: { type: String, require: true },
        description: { type: String, require: true },
        location: { type: String, require: true },
        createdAt: { type: Date, default: Date.now },
        imageUrl: { type: String, require: true },
        startDateTime: { type: Date, default: Date.now },
        endDateTime: { type: Date, default: Date.now },
        price: { type: String, require: true },
        isFree: { type: Boolean, default: false },
        url: { type: String },
        order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
        organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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

//* Version updation of Events
eventSchema.set("versionKey", "version");
eventSchema.plugin(updateIfCurrentPlugin);

//* Function to create new Event.
//* using it instead of 'new Event' to add type check
eventSchema.statics.build = (attrs: EventAttrs) => {
    return new Event({
        _id: attrs.id, // Ensure that _id is set correctly
        ...attrs,
    });
};

//* Function to find event by id
eventSchema.statics.findByEvent = (event: { id: string; version: number }) => {
    return Event.findOne({
        _id: event.id,
        version: event.version - 1,
    });
};

//* Function to check is event is reserved
eventSchema.methods.isReserved = async function () {
    // this === the event document that we just called 'isReserved' on
    const existingOrder = await Order.findOne({
        event: this,
        status: {
            $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete],
        },
    });
    return !!existingOrder;
};

const Event = mongoose.model<EventDoc, EventModel>("Event", eventSchema);

export { Event };
