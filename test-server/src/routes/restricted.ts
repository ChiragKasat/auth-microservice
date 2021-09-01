import { Request, Response, Router } from 'express';
import { verify } from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/unauthorized-error';

const router = Router();

interface TokenPayloadInterface {
	id: string;
	email?: string;
}

router.get('/restricted', async (req: Request, res: Response) => {
	const token = req.headers.authorization?.split('Bearer ')[1];

	if (!token) {
		throw new UnauthorizedError('No access token');
	}

	try {
		const { id, email } = (await verify(
			token,
			process.env.JWT_ACCESS_SECRET!
		)) as TokenPayloadInterface;
		return res.json({ id, email, restrictedInfo: 'Flam is awesome!' });
	} catch (e) {
		throw new UnauthorizedError('Access token expired');
	}
});

export { router as restrictedRouter };
