import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { TokenPayloadInterface } from '../interface/token_payload';

declare global {
	namespace Express {
		interface Request {
			currentUser?: TokenPayloadInterface;
		}
	}
}

export const addCurrentUser = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.session?.jwt) {
		try {
			const payload = verify(
				req.session.jwt,
				process.env.JWT_REFRESH_SECRET!
			) as TokenPayloadInterface;
			req.currentUser = payload;
		} catch (e) {
			req.session = null;
		}
	}
	next();
};
