import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
	statusCode = 403;

	constructor(public errors: ValidationError[]) {
		super('Error in request');

		Object.setPrototypeOf(this, RequestValidationError.prototype);
	}

	serializeErrors() {
		return this.errors.map(error => {
			return { message: error.msg, field: error.param };
		});
	}
}
