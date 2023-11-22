import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
    statusCode = 401; //* Error code for not authorized

    constructor() {
        super('Not Authorized');
        //* Only because we are extending a build in class
        Object.setPrototypeOf(this, NotAuthorizedError.prototype)
    }
    //* Method to serialize error to make it uniform across all services
    serializeErrors() {
        return [{ message: 'Not Authorized' }]
    }
}