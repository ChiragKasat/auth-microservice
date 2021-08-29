import { NextFunction, Request, Response } from 'express';

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!err) next();
	return res.status(403).json({ msg: 'Something went wrong' });
};
