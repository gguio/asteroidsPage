import "../styles/global.css";
import AppProvider from "../lib/context";

export default function App({
    Component,
    pageProps,
}: {
    Component: any;
    pageProps: any;
}) {
    return (
        <AppProvider>
            <Component {...pageProps} />
        </AppProvider>
    );
}
