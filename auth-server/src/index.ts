import * as dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';

import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';

import { errorHandler } from './middlewares/error-handler';

const main = async () => {
	try {
		const app = express();

		app.use(cors({ credentials: true }));
		app.use(express.json());

		app.use('/api/auth', signinRouter);
		app.use('/api/auth', signupRouter);
		app.use('/api/auth', signoutRouter);

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
