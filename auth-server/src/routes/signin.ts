import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../entities/User';
import { verify } from 'argon2';
import { createAccessToken, createRefreshToken } from '../utils/createTokens';
import { redisClient } from '../redisClient';

const router = Router();

router.post(
	'/signin',
	[
		body('email')
			.isEmail()
			.withMessage('Email must be a valid email')
			.normalizeEmail(),
		body('password')
			.trim()
			.notEmpty()
			.withMessage('Password cannot be empty')
			.escape()
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			throw new RequestValidationError(errors.array());
		}

		const { email, password } = req.body;

		const user = await User.findOne({ email });

		if (user === undefined) {
			throw new BadRequestError('Email not registered, signup first', 'email');
		}

		const payload = {
			id: user.id.toString(),
			email: user.email
		};

		const correct = await verify(user.password, password);

		if (correct) {
			try {
				const accessToken = await createAccessToken(payload);
				const refreshToken = await createRefreshToken(payload);

				res.cookie(process.env.ACCESS_COOKIE_NAME!, accessToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production'
				});

				req.session = {
					jwt: refreshToken
				};

				redisClient.set(user.id.toString(), refreshToken);

				return res.json({ ...payload, accessToken });
			} catch (e) {
				console.log(e);
				throw new BadRequestError('Something went wrong');
			}
		} else {
			req.session = null;
			await redisClient.del(user.id.toString());
			throw new BadRequestError('Invalid Credentials', 'password');
		}
	}
);

export { router as signinRouter };
