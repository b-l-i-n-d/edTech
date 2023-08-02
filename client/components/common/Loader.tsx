import { Spin } from "antd";
import Image from "next/image";
import React from "react";
import Logo from "../../public/assets/logos/logo_transparent.png";

const Loader: React.FC = () => {
    return (
        <div className="flex flex-col h-screen justify-center items-center">
            <div className="w-60">
                <Image
                    className="mb-60 w-full h-auto align-middle"
                    src={Logo}
                    alt="DOCAPP_Logo"
                />
            </div>
            <Spin size="large" />
        </div>
    );
};

export default Loader;
