import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { User } from "../models/users";
import { Password } from "../utilities/password";
import { BadRequestError, validateRequest } from "@kneeyaa/mshelper";

const router = express.Router();

// * @desc        User Sign in
// * @route       POST /api/users/signin
// * @access      Public
router.post(
    "/api/users/signin",
    [
        body("email").isEmail().withMessage("Email must be valid"),
        body("password").trim().notEmpty().withMessage("Please provide password"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        //* Check if user exist
        if (!existingUser) {
            throw new BadRequestError("Invalid Credentials");
        }

        //* Comparing password
        const passwordMatch = await Password.compare(existingUser.password, password);

        //* Wrong Password
        if (!passwordMatch) {
            throw new BadRequestError("Invalid Credentials");
        }

        //* Sucessful signin
        //* Generate JWT
        const userJwt = jwt.sign(
            {
                id: existingUser.id,
                name: existingUser.firstName + " " + existingUser.lastName,
                email: existingUser.email,
            },
            process.env.JWT_KEY!
        );

        //* Storing the JWT on session
        req.session = {
            jwt: userJwt,
        };

        res.status(200).send(existingUser);
    }
);

export { router as signinRouter };
