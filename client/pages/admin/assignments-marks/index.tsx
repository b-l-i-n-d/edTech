import { NextPage } from "next";
import Head from "next/head";
import { Auth } from "../../../components";

const AssignmentsMarks: NextPage = () => {
    return (
        <Auth.AdminOnly>
            <Head>
                <title>Assignments Marks</title>
            </Head>
            <div>AssignmentsMarks</div>
        </Auth.AdminOnly>
    );
};

export default AssignmentsMarks;
