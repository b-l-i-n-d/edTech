import { FormInstance } from "antd";
import type { SelectProps } from "antd/es/select";

export interface User {
    id: number;
    name: string;
    email: string;
    isEmailVerified: boolean;
    role: "user" | "admin";
}

export interface AuthState {
    tokens: {
        acess: {
            token: string;
        };
        refresh: {
            token: string;
        };
    } | null;
    user: User | null;
}

export interface VideosQueryParams {
    title?: string;
    description?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
    search?: string;
}

export interface Videos {
    results: Video[];
    totalResults: number;
    limit: number;
    page: number;
    totalPages: number;
}

export interface Video {
    id: string;
    title: string;
    description: string;
    url: string;
    thumbnail: string;
    duration: number;
}

export interface QuizzesQueryParams {
    question?: string;
    video?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
}

export interface Quizzes {
    results: Quizz[];
    totalResults: number;
    limit: number;
    page: number;
    totalPages: number;
}

export interface Quizz {
    id: string;
    question: string;
    description?: string;
    video: string | Video;
    options: Options[];
}

export interface QuizzParams {
    question: string;
    description?: string;
    video: string;
    options: Options[];
}

export interface Options {
    option: string;
    isCorrect: boolean;
}

export interface AssignmentsQueryParams {
    title?: string;
    video?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
}

export interface Assignments {
    results: Assignment[];
    totalResults: number;
    limit: number;
    page: number;
    totalPages: number;
}

export interface Assignment {
    id: string;
    title: string;
    video: string | Video;
    description?: string;
    dueDate: string;
    totalMarks: number;
}

export interface AssignmentParams {
    title: string;
    video: string;
    description?: string;
    dueDate: string;
    totalMarks: number;
}

export interface AssignmentsMarksQueryParams {
    assignment?: string;
    student?: string;
    status?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
}

export interface AssignmentsMarks {
    results: AssignmentMark[];
    totalResults: number;
    limit: number;
    page: number;
    totalPages: number;
}

export interface AssignmentMark {
    id: string;
    assignment: string | Assignment;
    student: string | User;
    marks: number;
    status: "pending" | "published";
    feedback?: string;
}

export interface AssignmentMarkParams {
    assignment: string;
    student: string;
    marks: number;
    status: "pending" | "published";
    feedback?: string;
}

export type ModalType = "add" | "edit" | "show";

export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, "options" | "children"> {
    debounceTimeout?: number;
    form?: FormInstance<any>;
}
