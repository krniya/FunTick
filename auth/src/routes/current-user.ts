import { currentUser } from "@kneeyaa/mshelper";
import express from "express";

const router = express.Router();

// * @desc        Return current logged in user
// * @route       GET /api/users/currentuser
// * @access      Private
router.get("/api/users/currentuser", currentUser, (req, res) => {
    res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
