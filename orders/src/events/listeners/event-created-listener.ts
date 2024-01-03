import { Message } from "node-nats-streaming";
import { Subjects, Listener, EventCreatedEvent } from "@kneeyaa/mshelper";
import { Event } from "../../models/event";
import { queueGroupName } from "./queue-group-name";

//* Event creation listner
export class EventCreatedListener extends Listener<EventCreatedEvent> {
    subject: Subjects.EventCreated = Subjects.EventCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: EventCreatedEvent["data"], msg: Message) {
        const {
            id,
            title,
            description,
            location,
            createdAt,
            imageUrl,
            startDateTime,
            endDateTime,
            price,
            isFree,
            url,
            category,
            organizer,
        } = data;
        //* Creating new event
        const event = Event.build({
            id,
            title,
            description,
            location,
            createdAt,
            imageUrl,
            startDateTime,
            endDateTime,
            price,
            isFree,
            url,
            category,
            organizer,
        });
        await event.save();
        //* Acknowlegement
        msg.ack();
    }
}
