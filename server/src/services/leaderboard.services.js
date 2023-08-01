import { AssignmentMark, QuizzMark } from '../models/index.js';

/**
 * Query for leaderboard
 * @returns {Promise<QueryResult>}
 */
const queryLeaderboard = async (student) => {
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
				from: 'users',
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
				photo: '$student.photo',
				quizzTotalMarks: '$totalMarks',
			},
		},
		{
			$sort: {
				quizzTotalMarks: -1,
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
				from: 'users',
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
				photo: '$student.photo',
				assignmentTotalMarks: '$totalMarks',
			},
		},
		{
			$sort: {
				assignmentTotalMarks: -1,
			},
		},
	]);

	const combinedMarks = [...quizzMarkLeaderboard, ...assignmentMarkLeaderboard];

	const mergedAndFilteredArray = combinedMarks.reduce((acc, curr) => {
		const existingStudent = acc.find((st) => st.id.toString() === curr.id.toString());

		if (existingStudent) {
			existingStudent.quizzTotalMarks = (existingStudent.quizzTotalMarks || 0) + (curr.quizzTotalMarks || 0);
			existingStudent.assignmentTotalMarks =
				(existingStudent.assignmentTotalMarks || 0) + (curr.assignmentTotalMarks || 0);
		} else {
			acc.push({
				...curr,
				quizzTotalMarks: curr.quizzTotalMarks || 0,
				assignmentTotalMarks: curr.assignmentTotalMarks || 0,
			});
		}
		return acc;
	}, []);

	const leaderboard = mergedAndFilteredArray
		.map((st) => {
			const totalMarks = (st.quizzTotalMarks || 0) + (st.assignmentTotalMarks || 0);
			return {
				...st,
				totalMarks,
			};
		})
		.sort((a, b) => b.totalMarks - a.totalMarks);

	let currentRank = 0;
	let prevMarks = null;

	const rankedLeaderboard = leaderboard.map((st) => {
		if (prevMarks !== st.totalMarks) {
			currentRank += 1;
		}
		prevMarks = st.totalMarks;
		return {
			...st,
			rank: currentRank,
		};
	});

	const studentData = student && rankedLeaderboard.find((st) => st.id.toString() === student.toString());

	return studentData
		? { student: studentData, leaderboard: rankedLeaderboard.slice(0, 25) }
		: { leaderboard: rankedLeaderboard };
};

export default { queryLeaderboard };
