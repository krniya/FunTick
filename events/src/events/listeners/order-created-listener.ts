import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@kneeyaa/mshelper";
import { queueGroupName } from "./queue-group-name";
import { Event } from "../../models/event";
import { EventUpdatedPublisher } from "../publishers/event-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        //* Find the event that the order is reserving
        const event = await Event.findById(data.event._id);

        //* If no event, throw error
        if (!event) {
            throw new Error("Event not found");
        }

        //* Mark the event as being reserved by setting its orderId property
        event.set({ order: { _id: data.id } });

        //* Save the event
        await event.save();
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
            order: event.order,
            category: event.category,
            organizer: event.organizer,
            version: event.version,
        });

        //* ack the message
        msg.ack();
    }
}
