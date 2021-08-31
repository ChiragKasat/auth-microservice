import { sign } from 'jsonwebtoken';
import { TokenPayloadInterface } from '../interface/token_payload';

export const createAccessToken = async (payload: TokenPayloadInterface) => {
	return sign(payload, process.env.JWT_ACCESS_SECRET!, {
		algorithm: 'HS512',
		expiresIn: process.env.JWT_ACCESS_EXPIRE || '5m'
	});
};

export const createRefreshToken = async (payload: TokenPayloadInterface) => {
	return sign(payload, process.env.JWT_REFRESH_SECRET!, {
		algorithm: 'HS512',
		expiresIn: process.env.JWT_REFRESH_EXPIRE || '5d'
	});
};
