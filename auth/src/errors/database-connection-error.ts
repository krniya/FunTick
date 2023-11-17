import { CustomError } from "./custom-error"

export class DatabaseConnectionError extends CustomError {
    reason = 'Error Connecting to database'
    statusCode = 503
    constructor() {
        super('Error Connecting to DB')

        //* Only because we are extending a build in class
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }

    serializeErrors() {
        return [
            {message: this.reason}
        ]
    }
}