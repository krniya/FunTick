import { Subjects, Listener, PaymentCreatedEvent, OrderStatus } from "@kneeyaa/mshelper";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

//* Payment recieved listner
export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
        // * Fetching order details
        const order = await Order.findById(data.orderId);

        // * If order not found / wrong order id provided
        if (!order) {
            throw new Error("Order not found");
        }
        // * Updating order status
        order.set({
            status: OrderStatus.Complete,
        });
        await order.save();
        // * Acknowledgement
        msg.ack();
    }
}
