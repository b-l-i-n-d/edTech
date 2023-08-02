import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Joi from 'joi';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
	.keys({
		NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
		PORT: Joi.number().default(3000),
		MONGODB_URL: Joi.string().required().description('Mongo DB url'),
		JWT_SECRET: Joi.string().required().description('JWT secret key'),
		JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
		JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
		JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
			.default(10)
			.description('minutes after which reset password token expires'),
		JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
			.default(10)
			.description('minutes after which verify email token expires'),
		SMTP_HOST: Joi.string().description('server that will send the emails'),
		SMTP_PORT: Joi.number().description('port to connect to the email server'),
		SMTP_USERNAME: Joi.string().description('username for email server'),
		SMTP_PASSWORD: Joi.string().description('password for email server'),
		EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
		CLOUDINARY_CLOUD_NAME: Joi.string().required().description('Cloudinary cloud name'),
		CLOUDINARY_API_KEY: Joi.string().required().description('Cloudinary API key'),
		CLOUDINARY_API_SECRET: Joi.string().required().description('Cloudinary API secret'),
		APP_URL: Joi.string().required().description('App URL'),
	})
	.unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

const env = envVars.NODE_ENV;
const port = envVars.PORT;
const mongoose = {
	url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
	options: {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
};
const jwt = {
	secret: envVars.JWT_SECRET,
	accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
	refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
	resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
	verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
};
const email = {
	smtp: {
		host: envVars.SMTP_HOST,
		port: envVars.SMTP_PORT,
		auth: {
			user: envVars.SMTP_USERNAME,
			pass: envVars.SMTP_PASSWORD,
		},
	},
	from: envVars.EMAIL_FROM,
};
const cloudinaryConfig = {
	cloudName: envVars.CLOUDINARY_CLOUD_NAME,
	apiKey: envVars.CLOUDINARY_API_KEY,
	apiSecret: envVars.CLOUDINARY_API_SECRET,
};
const appConfig = {
	url: envVars.APP_URL,
};

export default { appConfig, env, port, mongoose, jwt, email, cloudinaryConfig };
