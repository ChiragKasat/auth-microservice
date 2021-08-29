import { Request, Response, Router } from 'express';

const router = Router();

router.post('/signup', (req: Request, res: Response) => {
	res.json({});
});

export { router as signupRouter };
