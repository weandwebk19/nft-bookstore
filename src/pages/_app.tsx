import { useLayoutEffect, useRef, useState } from "react";

import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import "@styles/GlobalStyles/GlobalStyles.scss";
import { darkTheme, lightTheme } from "@styles/theme";
import gsap from "gsap";
import type { AppProps } from "next/app";

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
      <Loading />
      {/* <PageTransition ref={loaderRef} /> */}

      <Web3Provider>
        <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
          <CssBaseline />
          {Component.PageLayout ? (
            <Component.PageLayout onThemeChange={handleThemeChange}>
              <Component {...pageProps} />
            </Component.PageLayout>
          ) : (
            <DefaultLayout onThemeChange={handleThemeChange}>
              <Component {...pageProps} />
            </DefaultLayout>
          )}
        </ThemeProvider>
      </Web3Provider>
    </Box>
  );
}
