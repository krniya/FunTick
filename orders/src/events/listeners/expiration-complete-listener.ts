import { Listener, Subjects, ExpirationCompleteEvent, OrderStatus } from "@kneeyaa/mshelper";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

//* Expiration listner
export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

    async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
        // * Fetching the order
        const order = await Order.findById(data.orderId).populate("event");

        // * If order not found / wrong order id provided
        if (!order) {
            throw new Error("Order not found");
        }

        //* Acknowledge if checking order status is complete
        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        }

        //* Updating order status as cancelled
        order.set({
            status: OrderStatus.Cancelled,
        });

        await order.save();

        //* Publishing order cancellation
        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            createdAt: order.createdAt,
            event: order.event,
            buyer: order.user,
            version: order.version,
        });

        //* Acknowlegement
        msg.ack();
    }
}
