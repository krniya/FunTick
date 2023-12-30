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

// * @desc        Delete User
// * @route       DELETE /api/users/:id
// * @access      Private
router.delete("/api/users/:id", requireAuth, async (req: Request, res: Response) => {
    console.log(
        "🚀 ~ file: deleteUser.ts:20 ~ router.delete ~ req.currentUser!.id:",
        req.currentUser!.id
    );
    // * Trying to delete others user
    if (req.params.id !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    // * Deleting the user
    const deletedUser = User.findByIdAndDelete({ id: req.params.id });

    //* Removing JWT from session of deleted user
    req.session = null;
    res.send({ message: "User successfully deleted" });
});

export { router as userDeleteRouter };
