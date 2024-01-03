import { Message } from "node-nats-streaming";
import { Subjects, Listener, EventUpdatedEvent } from "@kneeyaa/mshelper";
import { Event } from "../../models/event";
import { queueGroupName } from "./queue-group-name";

// * Event updation event listner
export class EventUpdatedListener extends Listener<EventUpdatedEvent> {
    subject: Subjects.EventUpdated = Subjects.EventUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: EventUpdatedEvent["data"], msg: Message) {
        // * Fetching event
        const event = await Event.findByEvent(data);

        // * If event not available
        if (!event) {
            throw new Error("Event not found");
        }

        // * Fetching new event data
        const { title, price } = data;

        // * Updating event title and price
        event.set({ title, price });
        await event.save();

        // * Acknowledgement
        msg.ack();
    }
}
