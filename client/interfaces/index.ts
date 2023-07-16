import { FormInstance } from "antd";
import type { SelectProps } from "antd/es/select";

interface IResult {
    results: any[];
    totalResults: number;
    limit: number;
    page: number;
    totalPages: number;
}
export interface IUser {
    id: number;
    name: string;
    email: string;
    isEmailVerified: boolean;
    role: "user" | "admin";
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

export interface IVideosQueryParams {
    title?: string;
    description?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
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

export interface IQuizzesQueryParams {
    question?: string;
    video?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
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

export interface IAssignmentsQueryParams {
    title?: string;
    video?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
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

export interface IAssignmentsMarksQueryParams {
    assignment?: string;
    student?: string;
    status?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
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

export interface IQuizzMarksQueryParams {
    video?: string;
    student?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
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

export type ModalType = "add" | "edit" | "view";

export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, "options" | "children"> {
    debounceTimeout?: number;
    form?: FormInstance<any>;
}
