import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

/**
 * @param {string} type
 * @param {string} url
 */
export default function generateEmail(type, url) {
	const template = `src/templates/${type}.hbs`;

	const __dirname = path.resolve();
	// eslint-disable-next-line security/detect-non-literal-fs-filename
	const source = fs.readFileSync(path.join(__dirname, template), 'utf8');
	const compiledTemplate = handlebars.compile(source);
	const html = compiledTemplate({
		url,
	});

	return html;
}
