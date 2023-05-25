import { Router, useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAppSelector } from "../../redux/hooks";
import Common from "../common";

interface Props {
    children: React.ReactNode;
}

const AuthRequired: React.FC<Props> = ({ children }) => {
    const router = useRouter();
    const user = useAppSelector((state) => state.auth.user);

    if (!user) {
        router.replace("/login");
        return <Common.Loader />;
    }

    return <>{children}</>;
};

export default AuthRequired;
