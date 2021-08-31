import * as dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import morgan from 'morgan';
import { createConnection } from 'typeorm';
import cookieSession from 'cookie-session';

import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';

import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import { User } from './entities/User';
import { checkEnvironmentVariables } from './utils/checkEnvironmentVariables';

const isProd = process.env.NODE_ENV === 'production';

const main = async () => {
	checkEnvironmentVariables();

	try {
		await createConnection({
			type: 'postgres',
			host: process.env.POSTGRES_HOST,
			port: parseInt(process.env.POSTGRES_PORT!),
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DB,
			synchronize: true,
			logging: !isProd,
			entities: [User]
		});

		const app = express();

		app.use(cors({ credentials: true }));
		app.use(express.json());
		app.use(morgan('dev'));
		app.use(
			cookieSession({
				name: process.env.COOKIE_NAME,
				signed: false,
				secure: isProd,
				httpOnly: true,
				sameSite: 'lax'
			})
		);

		app.use('/api/auth', signinRouter);
		app.use('/api/auth', signupRouter);
		app.use('/api/auth', signoutRouter);

		app.all('*', async () => {
			throw new NotFoundError();
		});

		app.use(errorHandler);

		const PORT = process.env.PORT;
		app.listen(PORT, () => {
			console.log(`Server started on port ${PORT}`);
		});
	} catch (err) {
		console.error(err);
	}
};

main();
