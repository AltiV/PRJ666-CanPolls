// Model for express-validator error returned by API
export class ValidationError {
    location: string;
    msg: string;
    param: string;
    value: string;
}