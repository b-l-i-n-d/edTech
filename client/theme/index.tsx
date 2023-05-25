import { ConfigProvider } from "antd";
import React from "react";

const withTheme = (node: JSX.Element) => (
    <ConfigProvider>{node}</ConfigProvider>
);

export default withTheme;
