import express, { Request, Response } from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { createEventRouter } from "./routes/createNewEvent";
import { showEventRouter } from "./routes/getEvent";
import { indexEventRouter } from "./routes/getAllEvents";
import { updateEventRouter } from "./routes/updateEvent";
import { currentUser, NotFoundError, errorHandler } from "@kneeyaa/mshelper";
import { createCategoryRouter } from "./routes/createCategory";
import { getCategoriesRouter } from "./routes/getAllCategory";
import { deleteEventRouter } from "./routes/deleteEvent";
import { getEventByUserIdRouter } from "./routes/getEventsByUser";
import { getEventByCategorydRouter } from "./routes/getEventsByCategory";

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

app.use(deleteEventRouter); // * Route to delete event
app.use(getEventByUserIdRouter); // * Route to get Events by user id
app.use(createCategoryRouter); // * Route to create category
app.use(getCategoriesRouter); // * Route to get all categories
app.use(createEventRouter); //* Route to create new Events
app.use(showEventRouter); //* Route to get Event based on id
app.use(indexEventRouter); //* Route to get all Events
app.use(updateEventRouter); //* Route to update the Event details
app.use(getEventByCategorydRouter); // * Route to get events by category

//* Error handling for incorrect route
//* Throwing Error 404 Not Found
app.all("*", async (req: Request, res: Response) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };
