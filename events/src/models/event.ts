import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

//* An interface that describes the properties
//* that are required to create a new Event
interface EventAttrs {
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
        order: { type: String },
        category: { _id: String, name: String },
        organizer: {
            _id: String,
            firstName: String,
            lastName: String,
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

//* Version updation of Events
eventSchema.set("versionKey", "version");
eventSchema.plugin(updateIfCurrentPlugin);

//* Function to create new Event.
//* using it instead of 'new Event' to add type check
eventSchema.statics.build = (attrs: EventAttrs) => {
    return new Event({
        _id: new mongoose.Types.ObjectId(), // Ensure that _id is set correctly
        ...attrs,
    });
};

const Event = mongoose.model<EventDoc, EventModel>("Event", eventSchema);

export { Event };
