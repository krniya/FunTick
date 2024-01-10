import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects, OrderStatus } from "@kneeyaa/mshelper";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

// * Order created Listener
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    // * Creating new order locally
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const order = Order.build({
            id: data.id,
            createdAt: data.createdAt,
            event: data.event,
            user: data.buyer,
            expiresAt: data.expiresAt,
            status: data.status,
        });
        await order.save();
        // * Acknowlegement
        msg.ack();
    }
}
