import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import "@styles/GlobalStyles/GlobalStyles.scss";
import { darkTheme, lightTheme } from "@styles/theme";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

import { Web3Provider } from "@/components/providers";
import { Loading } from "@/components/shared/Loading";
import { PageTransition } from "@/components/shared/PageTransition";
import { DefaultLayout } from "@/layouts";

type PageLayoutProps = {
  onThemeChange: (theme: string) => void;
  children: React.ReactNode;
};

type ComponentWithPageLayout = AppProps & {
  Component: AppProps["Component"] & {
    PageLayout?: React.ComponentType<PageLayoutProps>;
  };
};

export default function App({ Component, pageProps }: ComponentWithPageLayout) {
  const router = useRouter();
  const app = useRef();
  // theming
  const [theme, setTheme] = useState("light");

  const handleThemeChange = (theme: string) => {
    switch (theme) {
      case "light":
        setTheme("light");
        break;
      case "dark":
        setTheme("dark");
        break;
      default:
        setTheme("light");
        break;
    }
  };

  // loading
  // const loaderRef = useRef<HTMLDivElement>(null);

  // useLayoutEffect(() => {
  //   let ctx = gsap.context(() => {
  //     gsap.to(loaderRef!.current, {
  //       x: "100%",
  //       ease: "expo",
  //       delay: 1
  //     });
  //   }, app);

  //   return () => ctx.revert();
  // }, []);

  return (
    <Box ref={app}>
      {/* <PageTransition ref={loaderRef} /> */}

      <Web3Provider>
        <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
          <CssBaseline />
          <AnimatePresence mode="wait">
            <motion.div
              key={router.route}
              initial="initialState"
              animate="animateState"
              exit="exitState"
              className="base-page-size"
              transition={{ duration: 0.75, delay: 0.25 }}
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
                <Component.PageLayout onThemeChange={handleThemeChange}>
                  <Component {...pageProps} />
                </Component.PageLayout>
              ) : (
                <DefaultLayout onThemeChange={handleThemeChange}>
                  <Component {...pageProps} />
                </DefaultLayout>
              )}
            </motion.div>
          </AnimatePresence>
        </ThemeProvider>
      </Web3Provider>
    </Box>
  );
}
