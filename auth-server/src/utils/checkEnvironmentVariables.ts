import * as dotenv from 'dotenv';
dotenv.config();
export const checkEnvironmentVariables = () => {
	const variables = [
		'NODE_ENV',
		'PORT',
		'POSTGRES_HOST',
		'POSTGRES_PORT',
		'POSTGRES_USER',
		'POSTGRES_PASSWORD',
		'POSTGRES_DB',
		'JWT_ACCESS_SECRET',
		'JWT_ACCESS_EXPIRE',
		'JWT_REFRESH_SECRET',
		'JWT_REFRESH_EXPIRE',
		'COOKIE_NAME'
	];

	variables.forEach(variable => {
		if (process.env[variable] === undefined) {
			throw Error(`${variable} environment variable not defined`);
		}
	});
};
