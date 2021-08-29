import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors/custom-error';

export const errorHandler = (
	err: Error,
	_: Request,
	res: Response,
	__: NextFunction
) => {
	if (err instanceof CustomError) {
		return res.status(err.statusCode).json({ errors: err.serializeErrors() });
	}
	return res
		.status(403)
		.json({ errors: [{ message: 'Something went wrong' }] });
};
