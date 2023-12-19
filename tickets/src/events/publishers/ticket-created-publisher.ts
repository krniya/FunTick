import { Publisher, Subjects, TicketCreatedEvent } from "@kneeyaa/mshelper";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
