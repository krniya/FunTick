import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

//* An interface that describes the properties
//* that are required to create a new Event
interface EventAttrs {
    title: string;
    price: number;
    userId: string;
}

//* An interface that describes the properties
//* that a Event document model has
interface EventDoc extends mongoose.Document {
    title: String;
    description: String;
    location: String;
    createdAt: Date;
    imageUrl: String;
    startDateTime: Date;
    endDateTime: Date;
    price: String;
    isFree: Boolean;
    url: String;
    category: mongoose.Schema.Types.ObjectId;
    organizer: mongoose.Schema.Types.ObjectId;
    userId: string;
    version: number;
}

//* An interface that describes the properties
//* that a Event model has
interface EventModel extends mongoose.Model<EventDoc> {
    build(attrs: EventAttrs): EventDoc;
}

//* Event Schema
//* {title, description, location, createdAt, imageUrl, startDateTime, endDateTime, price, isFree, url, category, organizer, toJSON()}
const eventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        location: { type: String },
        createdAt: { type: Date, default: Date.now },
        imageUrl: { type: String, required: true },
        startDateTime: { type: Date, default: Date.now },
        endDateTime: { type: Date, default: Date.now },
        price: { type: String },
        isFree: { type: Boolean, default: false },
        url: { type: String, require: true },
        userId: { type: String, required: true },
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
    return new Event(attrs);
};

const Event = mongoose.model<EventDoc, EventModel>("Event", eventSchema);

export { Event };
