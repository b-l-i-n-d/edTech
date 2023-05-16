import { createLogger, format, transports } from 'winston';
import config from './config.js';

const enumerateErrorFormat = format((info) => {
	if (info instanceof Error) {
		Object.assign(info, { message: info.stack });
	}
	return info;
});

const logger = createLogger({
	level: config.env === 'development' ? 'debug' : 'info',
	format: format.combine(
		enumerateErrorFormat(),
		config.env === 'development' ? format.colorize() : format.uncolorize(),
		format.splat(),
		format.printf(({ level, message }) => `${level}: ${message}`)
	),
	transports: [
		new transports.Console({
			stderrLevels: ['error'],
		}),
	],
});

export default logger;
