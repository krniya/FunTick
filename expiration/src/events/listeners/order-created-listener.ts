import { Listener, OrderCreatedEvent, Subjects } from "@kneeyaa/mshelper";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

// * Order event lister
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        // * Calculating delay
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log("Waiting this many milliseconds to process the job:", delay);

        // * Adding data to expiration queue
        await expirationQueue.add(
            {
                orderId: data.id,
            },
            {
                delay,
            }
        );
        // * Acknowlegement
        msg.ack();
    }
}
