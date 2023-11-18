import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
    statusCode = 400; //* Error code 400 for validation error
    constructor(public errors: ValidationError[]) {
        super('Invalid request parameter')

        //* Only because we are extending a build in class
        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }
    //* Method to serialize error to make it uniform across all services
    serializeErrors() {
        return this.errors.map(err=> {
            if (err.type == 'field') {
                return {message: err.msg, field: err.path}
            }
            return {message: err.msg, field: err.type}
        })
    }
}
