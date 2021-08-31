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
		'REFRESH_COOKIE_NAME',
		'ACCESS_COOKIE_NAME',
		'REDIS_URI'
	];

	variables.forEach(variable => {
		if (process.env[variable] === undefined) {
			throw Error(`${variable} environment variable not defined`);
		}
	});
};
