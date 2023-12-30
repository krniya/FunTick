import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/users";
import jwt from "jsonwebtoken";
import {
    BadRequestError,
    NotAuthorizedError,
    requireAuth,
    validateRequest,
} from "@kneeyaa/mshelper";

const router = express.Router();

// * @desc        Update basic user details
// * @route       PUT /api/users/:id
// * @access      Private
router.put(
    "/api/users/:id",
    requireAuth,
    [
        body("firstName").notEmpty().withMessage("Please provide your fisrt name"),
        body("lastName").notEmpty().withMessage("Please provide your last name"),
        body("email").isEmail().withMessage("Email must be valid"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { firstName, lastName, email, username, photo } = req.body;
        // * Trying to edit others user details
        if (req.params.id !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }
        //* Checking if email is already been used
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            throw new BadRequestError("Email already in use");
        }
        //* Checking if username is already been used
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            throw new BadRequestError("Username already in use");
        }
        // * Updating the user
        const user = User.findOneAndUpdate(
            { id: req.params.id },
            {
                firstName,
                lastName,
                email,
                username,
                photo,
            }
        );

        //* Generate JWT
        const userJwt = jwt.sign(
            {
                id: req.currentUser!.id,
                name: firstName + " " + lastName,
                email: email,
            },
            process.env.JWT_KEY!
        );

        //* Storing the JWT on session
        req.session = {
            jwt: userJwt,
        };
        res.status(200).send({ message: "User sucessfully updated" });
    }
);

export { router as userUpdateRouter };
