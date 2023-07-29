import {
    IAssignmentsMarksQueryParams,
    IQuizzMarksQueryParams,
    IQuizzSetsQueryParams,
    IQuizzesQueryParams,
    IUsersQueryParams,
    IVideosQueryParams,
} from "../interfaces";

export default function generateQueryUrl(
    url: string,
    params:
        | IUsersQueryParams
        | IVideosQueryParams
        | IQuizzesQueryParams
        | IAssignmentsMarksQueryParams
        | IQuizzMarksQueryParams
        | IQuizzSetsQueryParams
) {
    let query = url + "?";
    for (const [key, value] of Object.entries(params)) {
        if (value) {
            query += `${key}=${value}&`;
        }
    }
    return query;
}
