import { StyleProvider } from "@ant-design/cssinjs";
import { notification } from "antd";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { AppLayout } from "../components";
import "../public/antd.min.css";
import { wrapper } from "../redux/store";
import "../styles/globals.css";
import withTheme from "../theme";

const inter = Inter({ subsets: ["latin"] });

function App({ Component, ...rest }: AppProps) {
    const { store, props } = wrapper.useWrappedStore(rest);
    notification.config({
        placement: "bottomRight",
        duration: 3,
    });

    return (
        <Provider store={store}>
            <PersistGate persistor={store.__persistor} loading={null}>
                {withTheme(
                    <main className={inter.className}>
                        <StyleProvider hashPriority="high">
                            <AppLayout>
                                <Component {...props.pageProps} />
                            </AppLayout>
                        </StyleProvider>
                    </main>
                )}
            </PersistGate>
        </Provider>
    );
}

export default App;
