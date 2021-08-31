import { createClient } from 'redis';
import { promisify } from 'util';

export const redisClient = createClient({ url: process.env.REDIS_URI });

export const redisGetAsync = promisify(redisClient.get).bind(redisClient);
