import { Request, Response, NextFunction } from "express"
import { CustomError } from "../errors/custom-error"

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    //* Handling all kind of custom error
    //* Check custom-error.ts for implementation
    if (err instanceof CustomError){
        return res.status(err.statusCode).send({errors: err.serializeErrors()})
    }

    //* General error when its not been handled
    res.status(400).send({
        errors: [{
            message: "Something went wrong"
        }]
    })
    
}