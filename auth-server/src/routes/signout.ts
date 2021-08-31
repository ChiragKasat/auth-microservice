import { Request, Response, Router } from 'express';
import { addCurrentUser } from '../middlewares/add-current-user';
import { redisClient } from '../redisClient';
import { BadRequestError } from '../errors/bad-request-error';

const router = Router();

router.post('/signout', addCurrentUser, (req: Request, res: Response) => {
	try {
		req.session = null;
		if (req.currentUser) redisClient.del(req.currentUser.id.toString());
		res.json({});
	} catch (e) {
		console.log(e);
		throw new BadRequestError('Something went wrong. Try Again');
	}
});

export { router as signoutRouter };
