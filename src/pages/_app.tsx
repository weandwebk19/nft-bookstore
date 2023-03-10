import { useRef } from "react";

import { Box, CssBaseline } from "@mui/material";

import "@styles/GlobalStyles/GlobalStyles.scss";
import { AnimatePresence, motion } from "framer-motion";
import { appWithTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

import { Web3Provider } from "@/components/providers";
import { Loading } from "@/components/shared/Loading";
import { MyThemeContextProvider } from "@/contexts/ThemeContext";
import { DefaultLayout } from "@/layouts";

type PageLayoutProps = {
  children: React.ReactNode;
};

type ComponentWithPageLayout = AppProps & {
  Component: AppProps["Component"] & {
    PageLayout?: React.ComponentType<PageLayoutProps>;
  };
};

function App({ Component, pageProps }: ComponentWithPageLayout) {
  const router = useRouter();
  const app = useRef();

  return (
    <Box ref={app}>
      <Web3Provider>
        <MyThemeContextProvider>
          <CssBaseline />
          <AnimatePresence mode="wait">
            <motion.div
              key={router.route}
              initial="initialState"
              animate="animateState"
              exit="exitState"
              className="base-page-size"
              transition={{ duration: 0.3 }}
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
            </motion.div>
          </AnimatePresence>
        </MyThemeContextProvider>
      </Web3Provider>
    </Box>
  );
}

export default appWithTranslation(App);
