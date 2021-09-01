import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../entities/User';
import { hash } from 'argon2';
import { createAccessToken, createRefreshToken } from '../utils/createTokens';
import { redisClient } from '../redisClient';

const router = Router();

router.post(
	'/signup',
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

		const existingUser = await User.findOne({ email });

		if (existingUser !== undefined) {
			throw new BadRequestError('Email already registered.', 'email');
		}

		const hashedPassword = await hash(password);

		const newUser = await User.create({
			email,
			password: hashedPassword
		}).save();

		const payload = {
			id: newUser.id.toString(),
			email: newUser.email
		};

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

			redisClient.set(newUser.id.toString(), refreshToken);

			return res.json({ ...payload, accessToken });
		} catch (e) {
			console.log(e);
			throw new BadRequestError('Something went wrong');
		}
	}
);

export { router as signupRouter };
