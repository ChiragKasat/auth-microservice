import * as dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import morgan from 'morgan';

import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';

import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const main = async () => {
	try {
		const app = express();

		app.use(cors({ credentials: true }));
		app.use(express.json());
		app.use(morgan('dev'));

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
