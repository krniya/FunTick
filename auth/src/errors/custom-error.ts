//* Abstract class determine the properties of child class
//* To create all the custom errors handling features
export abstract class CustomError extends Error {
    abstract statusCode:number;  //* status code
    constructor(message: string) {
        super(message)
        //* Only because we are extending a build in class
        Object.setPrototypeOf(this, CustomError.prototype)
    }
    //* Method to serialize error to make it uniform across all services
    abstract serializeErrors(): {message: string; field?: string} []
}
