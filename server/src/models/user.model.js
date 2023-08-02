import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';
import validator from 'validator';
import { roles } from '../config/roles.js';
import { paginate, toJSON } from './plugins/index.js';

const userSchema = Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error('Invalid email');
				}
			},
		},
		password: {
			type: String,
			required: true,
			trim: true,
			minlength: 6,
			validate(value) {
				if (!value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/)) {
					throw new Error('Password should be combination of one uppercase, one lower case, one special char.');
				}
			},
			private: true, // used by the toJSON plugin
		},
		role: {
			type: String,
			enum: roles,
			default: 'user',
		},
		photo: {
			type: String,
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
		watchedVideos: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Video',
			},
		],
	},
	{
		timestamps: true,
	}
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
	const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
	return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
	const user = this;
	return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
	const user = this;
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

/**
 * @typedef User
 */
const User = model('User', userSchema);

export default User;
