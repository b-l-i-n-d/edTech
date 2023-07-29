// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-import
import { faker } from '@faker-js/faker';
import 'dotenv/config';
import mongoose from 'mongoose';
import config from './config/config.js';
import logger from './config/logger.js';
import { Assignment, Quizz, QuizzSet, Video } from './models/index.js';

mongoose
	.connect(config.mongoose.url, config.mongoose.options)
	.then(() => {
		logger.info('Connected to MongoDB');
	})
	.catch((error) => {
		logger.error(error);
	});

const generateYoutubeEmbeddedUrl = () => {
	const videoId = faker.string.alphanumeric({
		length: 11,
	}); // Generate a random 11-character video ID
	return `https://www.youtube.com/embed/${videoId}`;
};

const generateVideo = () => ({
	title: faker.lorem.sentence(),
	description: faker.lorem.paragraph(),
	url: generateYoutubeEmbeddedUrl(),
	thumbnail: faker.image.url(),
	duration: faker.number.int({ min: 60, max: 3600 }),
});

const generateOptions = () => {
	const optionsCount = faker.number.int({ min: 2, max: 4 });
	const options = [];

	const correctOptionsCount = faker.number.int({ min: 1, max: optionsCount });

	for (let i = 0; i < optionsCount; i += 1) {
		const isCorrect = i < correctOptionsCount;
		options.push({
			option: faker.lorem.words(),
			isCorrect,
		});
	}

	return options;
};

const createVideos = async () => {
	try {
		await Video.deleteMany();

		const videos = await Promise.all(
			Array.from({ length: 50 }, async () => {
				const video = await Video.create(generateVideo());
				return video;
			})
		);

		logger.info('Videos created successfully');
		return videos;
	} catch (error) {
		logger.error(error);
	}
};

const createQuizzes = async (videos) => {
	try {
		await Quizz.deleteMany();

		const quizzes = await Promise.all(
			Array.from({ length: 50 }, async () => {
				const video = videos[Math.floor(Math.random() * videos.length)];
				const quizz = await Quizz.create({
					question: faker.lorem.sentence(),
					description: faker.lorem.paragraph(),
					video: video._id,
					options: generateOptions(),
				});
				return quizz;
			})
		);

		logger.info('Quizzes created successfully');
		return quizzes;
	} catch (error) {
		logger.error(error);
	}
};

const createQuizzSets = async (quizzes) => {
	try {
		await QuizzSet.deleteMany();

		// Create an empty Map to store quizzes by video ID
		const quizzesByVideoId = new Map();

		// Group quizzes by video ID
		quizzes.forEach((quizz) => {
			const videoId = quizz.video.toString();
			if (quizzesByVideoId.has(videoId)) {
				quizzesByVideoId.get(videoId).push(quizz._id);
			} else {
				quizzesByVideoId.set(videoId, [quizz._id]);
			}
		});

		// Create quizz sets for each video
		const createQuizzSetPromises = Array.from(quizzesByVideoId.entries()).map(async ([videoId, quizIds]) => {
			await QuizzSet.create({
				video: videoId,
				quizzes: quizIds,
			});
		});

		await Promise.all(createQuizzSetPromises);

		logger.info('Quizz sets created successfully');
	} catch (error) {
		logger.error(error);
	}
};

const createAssignments = async (videos) => {
	try {
		await Assignment.deleteMany();

		const assignments = await Promise.all(
			Array.from({ length: 50 }, async () => {
				const video = videos[Math.floor(Math.random() * videos.length)];
				const assessment = await Assignment.create({
					title: faker.lorem.sentence(),
					video: video._id,
					description: faker.lorem.paragraph(),
					dueDate: faker.date.soon({
						days: 7,
					}),
					totalMarks: faker.number.int({ min: 10, max: 100 }),
				});
				return assessment;
			})
		);

		logger.info('Assignments created successfully');
		return assignments;
	} catch (error) {
		logger.error(error);
	}
};

// const createAssignmentsMarks = async (assignments) => {
// 	try {
// 		await AssignmentMark.deleteMany();

// 		const assignmentsMarks = await Promise.all(
// 			Array.from({ length: 50 }, async () => {
// 				const assignment = assignments[Math.floor(Math.random() * assignments.length)];
// 				const assignmentMark = await AssignmentMark.create({
// 					assignment: assignment._id,
// 					student: '64631c0d568ac4c2ea957de9',
// 					repoLink: faker.internet.url(),
// 					webpageLink: faker.internet.url(),
// 				});
// 				return assignmentMark;
// 			})
// 		);

// 		logger.info('Assignments marks created successfully');
// 		return assignmentsMarks;
// 	} catch (error) {
// 		logger.error(error);
// 	}
// };

const seed = async () => {
	try {
		const videos = await createVideos();
		const quizzes = await createQuizzes(videos);
		await createQuizzSets(quizzes);
		await createAssignments(videos);
		// await createAssignmentsMarks(assignments);

		logger.info('Seeded successfully');
	} catch (error) {
		logger.error(error);
	} finally {
		mongoose.disconnect();
		logger.info('Disconnected from MongoDB');
	}
};

seed();
