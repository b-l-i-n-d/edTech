import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { User } from '../models/index.js';
import config from './config.js';
import token from './tokens.js';

const jwtOptions = {
	secretOrKey: config.jwt.secret,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
	try {
		if (payload.type !== token.tokenTypes.ACCESS) {
			throw new Error('Invalid token type');
		}
		const user = await User.findById(payload.sub);
		if (!user) {
			return done(null, false);
		}
		done(null, user);
	} catch (error) {
		done(error, false);
	}
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

// eslint-disable-next-line import/prefer-default-export
export { jwtStrategy };
