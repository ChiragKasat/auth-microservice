import * as dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';

const main = async () => {
	try {
		const app = express();

		app.use(cors({ credentials: true }));
		app.use(express.json());

		const PORT = process.env.PORT;
		app.listen(PORT, () => {
			console.log(`Server started on port ${PORT}`);
		});
	} catch (err) {
		console.error(err);
	}
};

main();
