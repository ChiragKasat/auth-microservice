import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { restrictedRouter } from './routes/restricted';

import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const main = async () => {
	try {
		if (!process.env.JWT_ACCESS_SECRET) {
			throw new Error('no Access Secret environment variable');
		}
		if (!process.env.PORT) {
			throw new Error('no PORT environment variable');
		}

		const app = express();

		app.use(cors({ credentials: true }));
		app.use(express.json());
		app.use(morgan('dev'));
		app.use(cookieParser());

		app.use('/api', restrictedRouter);

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
