import { Request, Response, Router } from 'express';

const router = Router();

router.post('/signin', (req: Request, res: Response) => {
	res.json({});
});

export { router as signinRouter };
