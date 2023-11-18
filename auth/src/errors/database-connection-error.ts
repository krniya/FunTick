import { CustomError } from "./custom-error"

export class DatabaseConnectionError extends CustomError {
    reason = 'Error Connecting to database'; //* reason property for better understanding
    statusCode = 503    //* Error code 503 for service unavailable as unable to connect with DB
    constructor() {
        super('Error Connecting to DB')

        //* Only because we are extending a build in class
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }
    //* Method to serialize error to make it uniform across all services
    serializeErrors() {
        return [
            {message: this.reason}
        ]
    }
}