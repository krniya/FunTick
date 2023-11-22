import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

//* Interface for user payload
interface userPayload {
    id: string,
    email: string
}

//* Adding current user to Request interface
declare global {
    namespace Express {
        interface Request {
            currentUser?: userPayload
        }
    }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
    //* Check if user got JWT in session
    if(!req.session?.jwt) {
        return next()
    }

    //* verifying the JWT and send back the current user
    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as userPayload
        req.currentUser = payload  
    } catch (err) {}
    next()
}