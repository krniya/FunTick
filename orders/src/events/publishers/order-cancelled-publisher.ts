import { Subjects, Publisher, OrderCancelledEvent } from "@kneeyaa/mshelper";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
