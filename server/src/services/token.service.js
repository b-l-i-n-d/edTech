import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import config from '../config/config.js';
import tokenConfig from '../config/tokens.js';
import { Token } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import userServices from './user.service.js';

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
	const payload = {
		sub: userId,
		iat: moment().unix(),
		exp: expires.unix(),
		type,
	};
	return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
	const tokenDoc = await Token.create({
		token,
		user: userId,
		expires: expires.toDate(),
		type,
		blacklisted,
	});
	return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
	const payload = jwt.verify(token, config.jwt.secret);
	const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
	if (!tokenDoc) {
		throw new Error('Token not found');
	}
	return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
	const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
	const accessToken = generateToken(user.id, accessTokenExpires, tokenConfig.tokenTypes.ACCESS);

	const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
	const refreshToken = generateToken(user.id, refreshTokenExpires, tokenConfig.tokenTypes.REFRESH);
	await saveToken(refreshToken, user.id, refreshTokenExpires, tokenConfig.tokenTypes.REFRESH);

	return {
		access: {
			token: accessToken,
			expires: accessTokenExpires.toDate(),
		},
		refresh: {
			token: refreshToken,
			expires: refreshTokenExpires.toDate(),
		},
	};
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email) => {
	const user = await userServices.getUserByEmail(email);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
	}
	const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
	const resetPasswordToken = generateToken(user.id, expires, tokenConfig.tokenTypes.RESET_PASSWORD);
	await saveToken(resetPasswordToken, user.id, expires, tokenConfig.tokenTypes.RESET_PASSWORD);
	return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user) => {
	const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
	const verifyEmailToken = generateToken(user.id, expires, tokenConfig.tokenTypes.VERIFY_EMAIL);
	await saveToken(verifyEmailToken, user.id, expires, tokenConfig.tokenTypes.VERIFY_EMAIL);
	return verifyEmailToken;
};

export default {
	generateToken,
	saveToken,
	verifyToken,
	generateAuthTokens,
	generateResetPasswordToken,
	generateVerifyEmailToken,
};
