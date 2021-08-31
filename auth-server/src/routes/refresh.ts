import { Request, Response, Router } from 'express';
import { addCurrentUser } from '../middlewares/add-current-user';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { createAccessToken } from '../utils/createTokens';
import { redisGetAsync } from '../redisClient';

const router = Router();

router.post('/refresh', addCurrentUser, async (req: Request, res: Response) => {
	if (!req.currentUser) {
		throw new UnauthorizedError('Please signin again');
	} else {
		const { id, email } = req.currentUser;
		const storedToken = await redisGetAsync(id);
		if (!storedToken) {
			throw new UnauthorizedError('Please signin again');
		} else {
			if (storedToken === req.session?.jwt) {
				const accessToken = await createAccessToken({ id, email });

				res.cookie(process.env.ACCESS_COOKIE_NAME!, accessToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production'
				});
			} else {
				throw new UnauthorizedError('Please signin again');
			}
		}
		return res.json({ id, email });
	}
});

export { router as refreshRouter };
