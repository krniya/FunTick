import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@kneeyaa/mshelper";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

// * Ticket updation event listner
export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
        // * Fetching ticket
        const ticket = await Ticket.findByEvent(data);

        // * If ticket not available
        if (!ticket) {
            throw new Error("Ticket not found");
        }

        // * Fetching new ticket data
        const { title, price } = data;

        // * Updating ticket title and price
        ticket.set({ title, price });
        await ticket.save();

        // * Acknowledgement
        msg.ack();
    }
}
