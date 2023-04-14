import type { AppProps } from "next/app";
import {ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import HeadComponent from '../components/head';
import { Ethereum, Polygon, Mumbai } from "@thirdweb-dev/chains";

function Kyousou({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider 
      activeChain={Mumbai}
      supportedChains={[Mumbai]}
    >
      <HeadComponent/>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default Kyousou;