import { Publisher, Subjects, EventUpdatedEvent } from "@kneeyaa/mshelper";

export class EventUpdatedPublisher extends Publisher<EventUpdatedEvent> {
    subject: Subjects.EventUpdated = Subjects.EventUpdated;
}
