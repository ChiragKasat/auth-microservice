import { Request, Response, Router } from 'express';
import { verify } from 'jsonwebtoken';
import { TokenPayloadInterface } from '../interface/token_payload';
import { UnauthorizedError } from '../errors/unauthorized-error';

const router = Router();

router.post('/user', async (req: Request, res: Response) => {
	const cookie = req.cookies[process.env.ACCESS_COOKIE_NAME!];
	console.log(cookie);

	try {
		const { id, email } = (await verify(
			cookie,
			process.env.JWT_ACCESS_SECRET!
		)) as TokenPayloadInterface;
		return res.json({ id, email });
	} catch (e) {
		throw new UnauthorizedError('Access token expired');
	}
});

export { router as userRouter };
