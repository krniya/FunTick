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
        const event = await Event.findById(data.event.id);

        //* Event not found / Wrong event id provided
        if (!event) {
            throw new Error("Event not found");
        }

        //* Event updated
        event.set({ orderId: undefined });
        await event.save();

        //* Event Updation event published
        await new EventUpdatedPublisher(this.client).publish({
            id: event.id,
            orderId: event.orderId,
            userId: event.userId,
            price: event.price,
            title: event.title,
            version: event.version,
        });

        msg.ack();
    }
}
