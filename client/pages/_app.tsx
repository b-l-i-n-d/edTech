import { StyleProvider } from "@ant-design/cssinjs";
import { notification } from "antd";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { Router } from "next/router";
import NProgress from "nprogress";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { AppLayout } from "../components";
import "../public/antd.min.css";
import { wrapper } from "../redux/store";
import "../styles/globals.css";
import withTheme from "../theme";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

function App({ Component, ...rest }: AppProps) {
    const { store, props } = wrapper.useWrappedStore(rest);
    notification.config({
        placement: "bottomRight",
        duration: 3,
    });

    NProgress.configure({
        showSpinner: false,
        trickleSpeed: 100,
        easing: "ease",
        speed: 500,
        minimum: 0.1,
    });

    Router.events.on("routeChangeStart", (url) => {
        NProgress.start();
    });

    Router.events.on("routeChangeComplete", () => {
        NProgress.done(false);
    });

    return (
        <Provider store={store}>
            <PersistGate persistor={store.__persistor} loading={null}>
                {withTheme(
                    <main className={inter.variable}>
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
