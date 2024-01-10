import { Listener, OrderCancelledEvent, Subjects } from "@kneeyaa/mshelper";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Event } from "../../models/event";
import { EventUpdatedPublisher } from "../publishers/event-updated-publisher";

// * Order cancellation event triggered
export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        //* Fetching the event
        const event = await Event.findById(data.event._id);
        console.log("🚀 ~ OrderCancelledListener ~ onMessage ~ event:", event);

        //* Event not found / Wrong event id provided
        if (!event) {
            throw new Error("Event not found");
        }

        //* Event updated
        event.set({ order: undefined });
        await event.save();
        console.log("🚀 ~ OrderCancelledListener ~ onMessage ~ event:", event);
        const eve = await Event.findById(event.id);
        console.log("🚀 ~ OrderCancelledListener ~ onMessage ~ eve:", eve);
        //* Event Updation event published
        await new EventUpdatedPublisher(this.client).publish({
            id: event.id,
            title: event.title,
            location: event.location,
            createdAt: event.createdAt,
            imageUrl: event.imageUrl,
            startDateTime: event.startDateTime,
            endDateTime: event.endDateTime,
            price: event.price,
            isFree: event.isFree,
            url: event.url,
            category: event.category,
            organizer: event.organizer,
            version: event.version,
        });

        msg.ack();
    }
}
