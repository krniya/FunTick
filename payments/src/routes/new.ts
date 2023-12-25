import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
    requireAuth,
    validateRequest,
    BadRequestError,
    NotAuthorizedError,
    NotFoundError,
    OrderStatus,
} from "@kneeyaa/mshelper";
// import { stripe } from "../stripe";
const stripe = require("stripe")(process.env.STRIPE_KEY);
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

// * @desc        Making payment
// * @route       POST /api/payments
// * @access      Private
router.post(
    "/api/payments",
    requireAuth,
    [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
    validateRequest,
    async (req: Request, res: Response) => {
        const { token, orderId } = req.body;
        console.log(token);
        // * Fetching order details
        const order = await Order.findById(orderId);

        // * If no order found
        if (!order) {
            throw new NotFoundError();
        }

        // * Unauthorized order
        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        // * If order status is cancelled
        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError("Cannot pay for an cancelled order");
        }

        // * Creating the charge amount to be processed via stripe
        const product = await stripe.products.create({
            name: "Test",
            default_price_data: {
                unit_amount: order.price * 100,
                currency: "usd",
            },
            expand: ["default_price"],
        });

        const price = await stripe.prices.create({
            product: product.id,
            unit_amount: order.price * 100,
            currency: "usd",
        });

        const charge = await stripe.checkout.sessions.create({
            line_items: [
                {
                    // *  Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    price: price.id,
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: "http://localhost:4242/success",
        });
        // * Updating the payments table
        const payment = Payment.build({
            orderId,
            stripeId: charge.id,
        });
        payment.save();

        // * Publishing successful payment event
        new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId,
        });

        res.status(201).send({ id: payment.id });
    }
);

export { router as createChargeRouter };
