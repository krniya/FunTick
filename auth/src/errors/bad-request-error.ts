import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
    statusCode: number = 400        //* Error code 400 for bad request errors
    constructor(public message: string) {
        super(message)

        //* Only because we are extending a build in class
        Object.setPrototypeOf(this, BadRequestError.prototype)
    }
    //* Method to serialize error to make it uniform across all services
    serializeErrors() {
        return [{message: this.message}]
    }

}