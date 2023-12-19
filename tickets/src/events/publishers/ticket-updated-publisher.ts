import { Publisher, Subjects, TicketUpdatedEvent } from "@kneeyaa/mshelper";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
