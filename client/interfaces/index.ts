import { FormInstance, FormProps } from "antd";
import type { SelectProps } from "antd/es/select";
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
    videoId?: string;
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
    video: string | Video;
    options: Options[];
}

export interface QuizzParams {
    question: string;
    video: string;
    options: Options[];
}

export interface Options {
    option: string;
    isCorrect: boolean;
}

export type ModalType = "add" | "edit" | "show";

export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, "options" | "children"> {
    debounceTimeout?: number;
    form?: FormInstance<any>;
}
