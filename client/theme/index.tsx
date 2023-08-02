import React from "react";
import { ConfigProvider } from "antd";

const withTheme = (node: JSX.Element) => (
    <ConfigProvider>{node}</ConfigProvider>
);

export default withTheme;
