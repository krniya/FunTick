import { Publisher, Subjects, EventCreatedEvent } from "@kneeyaa/mshelper";

export class EventCreatedPublisher extends Publisher<EventCreatedEvent> {
    subject: Subjects.EventCreated = Subjects.EventCreated;
}
