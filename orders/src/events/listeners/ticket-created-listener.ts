import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@kneeyaa/mshelper";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

//* Ticket creation listner
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
        const { id, title, price } = data;
        //* Creating new ticket
        const ticket = Ticket.build({
            id,
            title,
            price,
        });
        await ticket.save();
        //* Acknowlegement
        msg.ack();
    }
}
