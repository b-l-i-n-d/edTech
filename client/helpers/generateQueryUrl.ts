import {
    AssignmentsMarksQueryParams,
    QuizzesQueryParams,
    VideosQueryParams,
} from "../interfaces";

export default function generateQueryUrl(
    url: string,
    params: VideosQueryParams | QuizzesQueryParams | AssignmentsMarksQueryParams
) {
    let query = url + "?";
    for (const [key, value] of Object.entries(params)) {
        if (value) {
            query += `${key}=${value}&`;
        }
    }
    return query;
}
