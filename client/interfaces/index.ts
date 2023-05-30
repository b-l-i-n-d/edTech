export interface VideosQueryParams {
    title?: string;
    description?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
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
