import { Schema, SchemaTypes, model } from 'mongoose';
import token from '../config/tokens.js';
import { toJSON } from './plugins/index.js';

const tokenSchema = Schema(
	{
		token: {
			type: String,
			required: true,
			index: true,
		},
		user: {
			type: SchemaTypes.ObjectId,
			ref: 'User',
			required: true,
		},
		type: {
			type: String,
			enum: [token.tokenTypes.REFRESH, token.tokenTypes.RESET_PASSWORD, token.tokenTypes.VERIFY_EMAIL],
			required: true,
		},
		expires: {
			type: Date,
			required: true,
		},
		blacklisted: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);
tokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

/**
 * @typedef Token
 */
const Token = model('Token', tokenSchema);

export default Token;
