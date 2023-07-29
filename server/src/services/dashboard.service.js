import mongoose from 'mongoose';
import { Assignment, AssignmentMark, QuizzMark, QuizzSet, Video } from '../models/index.js';

/**
 * Query for dashboard
 * @param {Object} filter - Mongo filter
 * @returns {Promise<QueryResult>}
 */
const queryDashboard = async (student) => {
	const totalQuizzSets = await QuizzSet.countDocuments({});
	const quizzSets = await QuizzSet.find({}, { video: 1 }, { sort: { video: 1 } }).populate({
		path: 'video',
		select: 'title',
	});
	const totalVideos = await Video.countDocuments({});
	// use aggregate to get totalQuizzTaken by student, also calculate sum of totalCorrect and totalMarks
	const quizzMarks = await QuizzMark.find(
		{ student },
		{ totalQuizzes: 1, totalCorrect: 1, totalMarks: 1, marks: 1, video: 1 }
	);
	const totalQuizzTaken = await QuizzMark.aggregate([
		{
			$match: {
				student: new mongoose.Types.ObjectId(student),
			},
		},
		{
			$group: {
				_id: null,
				totalQuizzes: {
					$sum: '$totalQuizzes',
				},
				totalCorrect: {
					$sum: '$totalCorrect',
				},
				totalMarksObtained: {
					$sum: '$marks',
				},
				totalMarks: {
					$sum: '$totalMarks',
				},
			},
		},
	]);
	const quizzTakenByStudent =
		totalQuizzTaken.length > 0 ? totalQuizzTaken[0] : { totalQuizzes: 0, totalCorrect: 0, totalMarks: 0 };

	const totalAssignmentTaken = await AssignmentMark.aggregate([
		{
			$match: {
				student: new mongoose.Types.ObjectId(student),
			},
		},
		{
			$lookup: {
				from: 'assignments', // Replace 'assignments' with the actual name of the 'assignments' collection
				localField: 'assignment',
				foreignField: '_id',
				as: 'assignmentDetails',
			},
		},
		{
			$unwind: '$assignmentDetails',
		},
		{
			$group: {
				_id: null,
				totalMarksObtained: {
					$sum: '$marks',
				},
				totalMarks: {
					$sum: '$assignmentDetails.totalMarks',
				},
			},
		},
	]);

	const assignmentTakenByStudent =
		totalAssignmentTaken.length > 0 ? totalAssignmentTaken[0] : { totalMarksObtained: 0, totalMarks: 0 };

	const quizzWithMarks = quizzSets.map((quizzSet) => {
		const quizzMark = quizzMarks.find((qM) => qM.video.toString() === quizzSet.video.id.toString());
		if (quizzMark) {
			return {
				...quizzSet.toJSON(),
				quizzMark: {
					totalQuizzes: quizzMark.totalQuizzes,
					totalCorrect: quizzMark.totalCorrect,
					totalMarks: quizzMark.totalMarks,
					marks: quizzMark.marks,
				},
			};
		}
		return quizzSet;
	});

	const totalAssignments = await Assignment.countDocuments({});
	const assignments = await Assignment.find({}, { title: 1, dueDate: 1, totalMarks: 1, video: 1 }, { sort: { video: 1 } });
	const assignmentMarks = await AssignmentMark.find(
		{
			student,
		},
		{ status: 1, marks: 1, assignment: 1, createdAt: 1 }
	);
	const assignmentWithMarks = assignments.map((assignment) => {
		const assignmentMark = assignmentMarks.find((aM) => aM.assignment.toString() === assignment.id.toString());

		if (assignmentMark) {
			return {
				...assignment.toJSON(),
				assignmentMark: {
					status: assignmentMark.status,
					marks: assignmentMark.marks,
					submittedAt: assignmentMark.createdAt,
				},
			};
		}
		return assignment;
	});

	const assignmentSubmittedOnTime =
		assignmentMarks.filter((aM) => {
			const assignment = assignments.find((a) => a.id.toString() === aM.assignment.toString());
			return assignment && aM.createdAt <= assignment.dueDate;
		}).length || 0;

	return {
		totalQuizzSets,
		totalVideos,
		totalAssignments,
		quizzReport: {
			totalQuizzTaken: quizzMarks.length,
			totalQuizzes: quizzTakenByStudent.totalQuizzes,
			totalCorrect: quizzTakenByStudent.totalCorrect,
			totalMarksObtained: quizzTakenByStudent.totalMarksObtained,
			totalMarks: quizzTakenByStudent.totalMarks,
		},
		quizzWithMarks,
		assignmentReport: {
			totalAssignmentTaken: assignmentMarks.length,
			totalMarksObtained: assignmentTakenByStudent.totalMarksObtained,
			totalMarks: assignmentTakenByStudent.totalMarks,
			assignmentSubmittedOnTime,
		},
		assignmentWithMarks,
	};
};

export default {
	queryDashboard,
};
