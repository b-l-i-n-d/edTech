import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import get from "lodash/get";

export default function isFetchBaseQueryError(
    error: unknown
): error is FetchBaseQueryError & { data: { message: string } } {
    return (
        typeof error === "object" &&
        error != null &&
        "status" in error &&
        "data" in error &&
        !!get(error, "data.message")
    );
}
