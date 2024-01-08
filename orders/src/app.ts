import express, { Request, Response } from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { currentUser, NotFoundError, errorHandler } from "@kneeyaa/mshelper";
import { deleteOrderRouter } from "./routes/deleteOrder";
import { indexOrderRouter } from "./routes/getAllOrders";
import { newOrderRouter } from "./routes/createOrder";
import { showOrderRouter } from "./routes/getOrder";

const app = express();
app.set("trust proxy", true); //* Express to trust proxied requests
app.use(json());
app.use(
    cookieSession({
        //* Cookie seesion to get JWT from cookie
        signed: false, //* As we got JWT, don't required to encrypt cookie
        secure: process.env.NODE_ENV !== "test", //* Only accept request at HTTPS (Prod environment only)
    })
);
app.use(currentUser);

app.use(deleteOrderRouter); //* Route to delete order
app.use(indexOrderRouter); //* Route to return all the orders
app.use(newOrderRouter); //* Route to create new order
app.use(showOrderRouter); //* Route to return one order

//* Error handling for incorrect route
//* Throwing Error 404 Not Found
app.all("*", async (req: Request, res: Response) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };
