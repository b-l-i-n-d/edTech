import { useRouter } from "next/router";
import React from "react";
import { useAppSelector } from "../../hooks";
import { selectUser } from "../../redux/features/auth/authSelector";
import Common from "../common";

interface Props {
    children: React.ReactNode;
}

const UserOnly: React.FC<Props> = ({ children }) => {
    const router = useRouter();
    const user = useAppSelector(selectUser);

    if (!user) {
        router.replace("/login");
        return <Common.Loader />;
    } else if (user && user?.role === "admin") {
        router.replace("/admin");
        return <Common.Loader />;
    }

    return <>{children}</>;
};

export default UserOnly;
