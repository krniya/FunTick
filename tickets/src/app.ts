import express, { Request, Response } from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes/index";
import { updateTicketRouter } from "./routes/update";
import { currentUser, NotFoundError, errorHandler } from "@kneeyaa/mshelper";

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

app.use(createTicketRouter); //* Route to create new tickets
app.use(showTicketRouter); //* Route to get ticket based on id
app.use(indexTicketRouter); //* Route to get all tickets
app.use(updateTicketRouter); //* Route to update the ticket details

//* Error handling for incorrect route
//* Throwing Error 404 Not Found
app.all("*", async (req: Request, res: Response) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };
