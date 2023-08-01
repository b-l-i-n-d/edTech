import { ConfigProvider } from "antd";

const withTheme = (node: JSX.Element) => (
    <ConfigProvider
        theme={{
            token: {
                colorPrimary: "#1777ff",
            },
        }}
    >
        {node}
    </ConfigProvider>
);

export default withTheme;
