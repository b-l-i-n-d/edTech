import { useRouter } from "next/router";
import React from "react";
import { useAppSelector } from "../../hooks";
import Common from "../common";

interface Props {
    children: React.ReactNode;
}

const LoginGuard: React.FC<Props> = ({ children }) => {
    const router = useRouter();
    const user = useAppSelector((state) => state.auth.user);

    if (user) {
        if (user.role === "admin") {
            router.replace("/admin");
        }
        if (user.role === "user") {
            router.replace("/");
        }
        return <Common.Loader />;
    }

    return <>{children}</>;
};

export default LoginGuard;
