import mongoose from "mongoose";

//* An interface that describes the properties
//* that are required to create a new Payment
interface PaymentAttrs {
    orderId: string;
    stripeId: string;
}

//* An interface that describes the properties
//* that a Payment document model has
interface PaymentDoc extends mongoose.Document {
    orderId: string;
    stripeId: string;
}

//* An interface that describes the properties
//* that a payment model has
interface PaymentModel extends mongoose.Model<PaymentDoc> {
    build(attrs: PaymentAttrs): PaymentDoc;
}

//* Payment Schema
//* {orderId, stripeId, toJSON()}
const paymentSchema = new mongoose.Schema(
    {
        orderId: {
            required: true,
            type: String,
        },
        stripeId: {
            required: true,
            type: String,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

//* Function to create new Payment.
//* using it instead of 'new Payment' to add type check
paymentSchema.statics.build = (attrs: PaymentAttrs) => {
    return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>("Payment", paymentSchema);

export { Payment };
