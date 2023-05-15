import { useRef } from "react";

import { Box, CssBaseline } from "@mui/material";

import Portal from "@mui/base/Portal";
import "@styles/GlobalStyles/GlobalStyles.scss";
import { AnimatePresence, motion } from "framer-motion";
import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import {
  WagmiConfig,
  configureChains,
  createClient,
  goerli,
  mainnet
} from "wagmi";
import { polygon, sepolia } from "wagmi/chains";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { Web3Provider } from "@/components/providers";
import { Cursor } from "@/components/shared/Cursor";
import { Loading } from "@/components/shared/Loading";
import { ScrollButton } from "@/components/shared/ScrollButton";
import { MyThemeContextProvider } from "@/contexts/ThemeContext";
import { DefaultLayout } from "@/layouts";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

type PageLayoutProps = {
  children: React.ReactNode;
};

type ComponentWithPageLayout = AppProps & {
  Component: AppProps["Component"] & {
    PageLayout?: React.ComponentType<PageLayoutProps>;
  };
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...namespaceDefaultLanguage()]))
    }
  };
}

export const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, polygon, goerli, sepolia],
  [
    alchemyProvider({ apiKey: "sqU5f8EM6nGsof_7HCwxqxwGBQPQUTxa" }),
    publicProvider()
  ]
);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi"
      }
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: "c06100850b08bbad923d20bb6ef2e5a9",
        showQrModal: true
      }
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true
      }
    })
  ],
  provider,
  webSocketProvider
});

function App({ Component, pageProps }: ComponentWithPageLayout) {
  const router = useRouter();
  const app = useRef();

  return (
    <Box ref={app}>
      <Web3Provider>
        <WagmiConfig client={client}>
          <SessionProvider session={pageProps.session} refetchInterval={0}>
            <MyThemeContextProvider>
              <CssBaseline />
              {/* <Cursor /> */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={router.route}
                  initial="initialState"
                  animate="animateState"
                  exit="exitState"
                  className="base-page-size"
                  transition={{ duration: 0.2 }}
                  variants={{
                    initialState: {
                      opacity: 0,
                      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"
                    },
                    animateState: {
                      opacity: 1,
                      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"
                    },
                    exitState: {
                      clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)"
                    }
                  }}
                >
                  <Portal>
                    <Loading />

                    {Component.PageLayout ? (
                      <Component.PageLayout>
                        <Component {...pageProps} />
                      </Component.PageLayout>
                    ) : (
                      <DefaultLayout>
                        <Component {...pageProps} />
                      </DefaultLayout>
                    )}

                    <ScrollButton />
                  </Portal>
                </motion.div>
              </AnimatePresence>
            </MyThemeContextProvider>
          </SessionProvider>
        </WagmiConfig>
      </Web3Provider>
    </Box>
  );
}

export default appWithTranslation(App);
