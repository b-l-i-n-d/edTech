import { AssignmentMark, QuizzMark } from '../models/index.js';

/**
 * Query for leaderboard
 * @returns {Promise<QueryResult>}
 */
const queryLeaderboard = async (student) => {
	// use aggregate to get tomalMarks per student
	const quizzMarkLeaderboard = await QuizzMark.aggregate([
		{
			$group: {
				_id: '$student',
				totalMarks: {
					$sum: '$marks',
				},
			},
		},
		{
			$lookup: {
				from: 'users', // Replace 'students' with the actual name of the 'students' collection
				localField: '_id',
				foreignField: '_id',
				as: 'student',
			},
		},
		{
			$unwind: '$student',
		},
		{
			$project: {
				_id: 0,
				id: '$student._id',
				name: '$student.name',
				totalMarks: '$totalMarks',
			},
		},
		{
			$sort: {
				totalMarks: -1,
			},
		},
	]);

	const assignmentMarkLeaderboard = await AssignmentMark.aggregate([
		{
			$group: {
				_id: '$student',
				totalMarks: {
					$sum: '$marks',
				},
			},
		},
		{
			$lookup: {
				from: 'users', // Replace 'students' with the actual name of the 'students' collection
				localField: '_id',
				foreignField: '_id',
				as: 'student',
			},
		},
		{
			$unwind: '$student',
		},
		{
			$project: {
				_id: 0,
				id: '$student._id',
				name: '$student.name',
				totalMarks: '$totalMarks',
			},
		},
		{
			$sort: {
				totalMarks: -1,
			},
		},
	]);

	const combinedLeaderboard = [...quizzMarkLeaderboard, ...assignmentMarkLeaderboard];

	const leaderboard = combinedLeaderboard.reduce((acc, curr) => {
		const existingStudent = acc.find((st) => st.id.toString() === curr.id.toString());
		if (existingStudent) {
			existingStudent.totalMarks += curr.totalMarks;
		} else {
			acc.push(curr);
		}
		return acc;
	}, []);

	leaderboard.sort((a, b) => b.totalMarks - a.totalMarks);

	let rank = 1;

	leaderboard.forEach((st, index) => {
		if (index > 0 && student.totalMarks === leaderboard[index - 1].totalMarks) {
			// eslint-disable-next-line no-param-reassign
			st.rank = leaderboard[index - 1].rank;
		} else {
			// eslint-disable-next-line no-param-reassign
			st.rank = rank;
			rank += 1;
		}
	});

	const studentData = leaderboard.find((st) => st.id.toString() === student.toString());

	return {
		student: studentData,
		leaderboard: leaderboard.slice(0, 25),
	};
};

export default { queryLeaderboard };
