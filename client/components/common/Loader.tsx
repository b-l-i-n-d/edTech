import { Spin } from "antd";
import React from "react";
import Logo from "../../public/assets/logos/logo_transparent.png";
import Image from "next/image";

const Loader: React.FC = () => {
    return (
        <div className="flex flex-col h-screen justify-center items-center">
            <Image
                className="mb-60"
                src={Logo}
                alt="DOCAPP_Logo"
                width={250}
                height={250}
            />
            <Spin size="large" />
        </div>
    );
};

export default Loader;
