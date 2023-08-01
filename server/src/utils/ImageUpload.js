import { v2 as cloudinary } from 'cloudinary';
import config from '../config/config.js';

cloudinary.config({
	cloud_name: config.cloudinaryConfig.cloudName,
	api_key: config.cloudinaryConfig.apiKey,
	api_secret: config.cloudinaryConfig.apiSecret,
});

export default async function imageUpload(file, id) {
	try {
		const result = await cloudinary.uploader.upload(file, {
			public_id: id,
			folder: 'learing-platform/users',
		});
		return result;
	} catch (error) {
		return error;
	}
}
