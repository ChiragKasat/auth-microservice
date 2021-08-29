import { Request, Response, Router } from 'express';

const router = Router();

router.post('/signout', (req: Request, res: Response) => {
	res.json({});
});

export { router as signoutRouter };
