import httpStatus from 'http-status';
import { tokenTypes } from '../config/tokens.js';
import Token from '../models/token.model.js';
import ApiError from '../utils/ApiError.js';
import { generateAuthTokens, verifyToken } from './token.service.js';
import { getUserByEmail, getUserById, updateUserById } from './user.service.js';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
	const user = await getUserByEmail(email);
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
	const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
	if (!refreshTokenDoc) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
	}
	await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
	try {
		const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH);
		const user = await getUserById(refreshTokenDoc.user);
		if (!user) {
			throw new Error();
		}
		await refreshTokenDoc.remove();
		return generateAuthTokens(user);
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
		const resetPasswordTokenDoc = await verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
		const user = await getUserById(resetPasswordTokenDoc.user);
		if (!user) {
			throw new Error();
		}
		await updateUserById(user.id, { password: newPassword });
		await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
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
		const verifyEmailTokenDoc = await verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
		const user = await getUserById(verifyEmailTokenDoc.user);
		if (!user) {
			throw new Error();
		}
		await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
		await updateUserById(user.id, { isEmailVerified: true });
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
