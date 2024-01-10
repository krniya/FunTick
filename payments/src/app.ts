import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@kneeyaa/mshelper";
import { createChargeRouter } from "./routes/makePayment";

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

app.use(createChargeRouter); // * Route to create payment

//* Error handling for incorrect route
//* Throwing Error 404 Not Found
app.all("*", async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };
