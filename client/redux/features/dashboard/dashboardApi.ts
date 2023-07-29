import { IDashboardData } from "../../../interfaces";
import { apiSlice } from "../../api/apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardData: builder.query<IDashboardData, string>({
            query: (student) => ({
                url: `dashboard?student=${student}`,
                method: "GET",
            }),
            providesTags: ["Dashboard"],
        }),
    }),
});

export const { useGetDashboardDataQuery } = dashboardApi;
