import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Vikum Warnakula</title>
        <link rel="icon" href="/profile.jpg" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;