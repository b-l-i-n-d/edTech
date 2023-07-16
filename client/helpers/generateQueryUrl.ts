import {
    IAssignmentsMarksQueryParams,
    IQuizzMarksQueryParams,
    IQuizzesQueryParams,
    IVideosQueryParams,
} from "../interfaces";

export default function generateQueryUrl(
    url: string,
    params:
        | IVideosQueryParams
        | IQuizzesQueryParams
        | IAssignmentsMarksQueryParams
        | IQuizzMarksQueryParams
) {
    let query = url + "?";
    for (const [key, value] of Object.entries(params)) {
        if (value) {
            query += `${key}=${value}&`;
        }
    }
    return query;
}
