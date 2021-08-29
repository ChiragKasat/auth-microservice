import * as dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';

import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';

const main = async () => {
	try {
		const app = express();

		app.use(cors({ credentials: true }));
		app.use(express.json());

		app.use('/api', signinRouter);
		app.use('/api', signupRouter);
		app.use('/api', signoutRouter);

		const PORT = process.env.PORT;
		app.listen(PORT, () => {
			console.log(`Server started on port ${PORT}`);
		});
	} catch (err) {
		console.error(err);
	}
};

main();
