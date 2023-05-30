import httpStatus from 'http-status';
import token from '../config/tokens.js';
import Token from '../models/token.model.js';
import ApiError from '../utils/ApiError.js';
import tokenServices from './token.service.js';
import userServices from './user.service.js';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
	const user = await userServices.getUserByEmail(email);
	if (!user || !(await user.isPasswordMatch(password))) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
	}
	return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
	const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: token.tokenTypes.REFRESH, blacklisted: false });
	if (!refreshTokenDoc) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
	}
	await refreshTokenDoc.deleteOne();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
	try {
		const refreshTokenDoc = await tokenServices.verifyToken(refreshToken, token.tokenTypes.REFRESH);
		const user = await userServices.getUserById(refreshTokenDoc.user);
		if (!user) {
			throw new Error();
		}
		await refreshTokenDoc.deleteOne();
		return tokenServices.generateAuthTokens(user);
	} catch (error) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
	}
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
	try {
		const resetPasswordTokenDoc = await tokenServices.verifyToken(resetPasswordToken, token.tokenTypes.RESET_PASSWORD);
		const user = await userServices.getUserById(resetPasswordTokenDoc.user);
		if (!user) {
			throw new Error();
		}
		await userServices.updateUserById(user.id, { password: newPassword });
		await Token.deleteMany({ user: user.id, type: token.tokenTypes.RESET_PASSWORD });
	} catch (error) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
	}
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
	try {
		const verifyEmailTokenDoc = await tokenServices.verifyToken(verifyEmailToken, token.tokenTypes.VERIFY_EMAIL);
		const user = await userServices.getUserById(verifyEmailTokenDoc.user);
		if (!user) {
			throw new Error();
		}
		await Token.deleteMany({ user: user.id, type: token.tokenTypes.VERIFY_EMAIL });
		await userServices.updateUserById(user.id, { isEmailVerified: true });
	} catch (error) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
	}
};

export default {
	loginUserWithEmailAndPassword,
	logout,
	refreshAuth,
	resetPassword,
	verifyEmail,
};
