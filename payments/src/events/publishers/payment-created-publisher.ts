import { Subjects, Publisher, PaymentCreatedEvent } from "@kneeyaa/mshelper";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
