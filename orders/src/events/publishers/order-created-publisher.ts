import { Publisher, OrderCreatedEvent, Subjects } from "@kneeyaa/mshelper";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
