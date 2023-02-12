import { useState } from "react";

import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import "@styles/GlobalStyles/GlobalStyles.scss";
import { darkTheme, lightTheme } from "@styles/theme";
import type { AppProps } from "next/app";

import { Web3Provider } from "@/components/providers";
import { Loading } from "@/components/shared/Loading";

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

  return (
    <Web3Provider>
      <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
        <CssBaseline />
        {/* {Component.PageLayout ? (
          <Component.PageLayout onThemeChange={handleThemeChange}>
            <Component {...pageProps} />
          </Component.PageLayout>
        ) : (
          <Component {...pageProps} />
        )} */}
        <Loading />
      </ThemeProvider>
    </Web3Provider>
  );
}
