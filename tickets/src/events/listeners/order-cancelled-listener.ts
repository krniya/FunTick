import { Listener, OrderCancelledEvent, Subjects } from "@kneeyaa/mshelper";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

// * Order cancellation event triggered
export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        //* Fetching the ticket
        const ticket = await Ticket.findById(data.ticket.id);

        //* Ticket not found / Wrong ticket id provided
        if (!ticket) {
            throw new Error("Ticket not found");
        }

        //* Ticket updated
        ticket.set({ orderId: undefined });
        await ticket.save();

        //* Ticket Updation event published
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            orderId: ticket.orderId,
            userId: ticket.userId,
            price: ticket.price,
            title: ticket.title,
            version: ticket.version,
        });

        msg.ack();
    }
}
