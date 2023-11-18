import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
    statusCode: number = 404; //* Error code 404 for Not Found errors
    constructor() {
        super('Route not found');
        //* Only because we are extending a build in class
        Object.setPrototypeOf(this, NotFoundError.prototype)
    }
    //* Method to serialize error to make it uniform across all services
    serializeErrors() {
        return [{message: 'Not Found'}];
    }
}