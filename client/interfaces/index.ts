import { FormInstance } from "antd";
import type { SelectProps } from "antd/es/select";

interface IResult {
    results: any[];
    totalResults: number;
    limit: number;
    page: number;
    totalPages: number;
}

export interface IResultQueryParams {
    sortBy?: string;
    page?: number;
    limit?: number;
}

export interface IUser {
    id: string;
    name: string;
    email: string;
    isEmailVerified: boolean;
    role: "user" | "admin";
    photo: string;
    watchedVideos: string[] | IVideo[];
}

export interface IUsers extends IResult {
    results: IUser[];
}

export interface IUsersQueryParams extends IResultQueryParams {
    name?: string;
    role?: string;
}

export interface IAuthState {
    tokens: {
        acess: {
            token: string;
        };
        refresh: {
            token: string;
        };
    } | null;
    user: IUser | null;
}

export interface IVideosQueryParams extends IResultQueryParams {
    title?: string;
    description?: string;
    search?: string;
}

export interface IVideos extends IResult {
    results: IVideo[];
}

export interface IVideo {
    id: string;
    title: string;
    description: string;
    url: string;
    thumbnail: string;
    duration: number;
}

export interface IVideoState {
    currentVideoId: string | null;
}

export interface IQuizzesQueryParams extends IResultQueryParams {
    question?: string;
    video?: string;
}

export interface IQuizzes extends IResult {
    results: IQuizz[];
}

export interface IQuizz {
    id: string;
    question: string;
    description?: string;
    video: string | IVideo;
    options: IQuizzOptions[];
}

export interface IQuizzParams {
    question: string;
    description?: string;
    video: string;
    options: IQuizzOptions[];
}

export interface IQuizzOptions {
    _id?: string;
    option: string;
    isCorrect: boolean;
}

export interface IQuizzSetsQueryParams extends IResultQueryParams {
    video?: string;
}

export interface IQuizzSets extends IResult {
    results: IQuizzSet[];
}

export interface IQuizzSet {
    id: string;
    video: string | IVideo;
    quizzes: string[] | IQuizz[];
}

export interface IAssignmentsQueryParams extends IResultQueryParams {
    title?: string;
    video?: string;
}

export interface IAssignments extends IResult {
    results: IAssignment[];
}

export interface IAssignment {
    id: string;
    title: string;
    video: string | IVideo;
    description?: string;
    dueDate: string;
    totalMarks: number;
}

export interface IAssignmentParams {
    title: string;
    video: string;
    description?: string;
    dueDate: string;
    totalMarks: number;
}

export interface IAssignmentsMarksQueryParams extends IResultQueryParams {
    assignment?: string;
    student?: string;
    status?: string;
}

export interface IAssignmentsMarks extends IResult {
    results: IAssignmentMark[];
}

export interface IAssignmentMark {
    id: string;
    assignment: string | IAssignment;
    student: string | IUser;
    marks: number;
    status: "pending" | "published";
    repoLink: string;
    webpageLink: string;
    feedback?: string;
}

export interface IAssignmentMarkParams {
    assignment: string;
    student: string;
    repoLink: string;
    webpageLink: number;
    feedback?: string;
}

export interface IQuizzMarksQueryParams extends IResultQueryParams {
    video?: string;
    student?: string;
}

export interface IQuizzMarks extends IResult {
    results: IQuizzMark[];
}

export interface IQuizzMark {
    id: string;
    video: string | IVideo;
    student: string | IUser;
    totalQuizzes: number;
    totalCorrect: number;
    totalWrong: number;
    totalMarks: number;
    marks: number;
    correctAnswers: object[];
    selectedAnswers: object[];
}

export interface IQuizzMarkParams {
    video: string;
    student: string;
    selectedAnswers: object[];
}

export interface IDashboardData {
    totalQuizzSets: number;
    totalVideos: number;
    totalAssignments: number;
    quizzReport: {
        totalQuizzTaken: number;
        totalQuizzes: number;
        totalCorrect: number;
        totalMarksObtained: number;
        totalMarks: number;
    };
    quizzWithMarks: {
        id: string;
        video: {
            id: string;
            title: string;
        };
        quizzMark?: {
            totalQuizzes: number;
            totalCorrect: number;
            totalMarks: number;
            marks: number;
        };
    }[];
    assignmentReport: {
        totalAssignmentTaken: number;
        totalMarksObtained: number;
        totalMarks: number;
        assignmentSubmittedOnTime: number;
    };
    assignmentWithMarks: {
        id: string;
        title: string;
        dueDate: string;
        totalMarks: number;
        video: string;
        assignmentMark?: {
            status: "pending" | "published";
            marks: number;
            submittedAt: string;
        };
    }[];
}

export interface ILeaderboard {
    student?: {
        id: string;
        name: string;
        photo: string;
        quizzTotalMarks: number;
        assignmentTotalMarks: number;
        totalMarks: number;
        rank: number;
    };
    leaderboard: {
        id: string;
        name: string;
        photo: string;
        quizzTotalMarks: number;
        assignmentTotalMarks: number;
        totalMarks: number;
        rank: number;
    }[];
}

export type ModalType =
    | "add"
    | "edit"
    | "view"
    | "submit-assignment"
    | "submit-quizz"
    | "view-assignment"
    | "view-quizz";

export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, "options" | "children"> {
    debounceTimeout?: number;
    form?: FormInstance<any>;
}
