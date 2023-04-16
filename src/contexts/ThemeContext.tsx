import { createContext, useContext, useEffect, useState } from "react";

import { ThemeProvider } from "@mui/material/styles";

import { darkTheme, lightTheme } from "@styles/theme";

import { useLocalStorage } from "@/components/hooks/common";

export function useMyTheme() {
  return useLocalStorage("theme", "light");
}

const MyThemeContext = createContext("light");
const SetMyThemeContext = createContext((value: string) => {
  console.log("Default function:", value);
});

export function useMyThemeContext() {
  return useContext(MyThemeContext);
}

export function useSetMyThemeContext() {
  return useContext(SetMyThemeContext);
}

interface MyThemeContextProviderProps {
  children: React.ReactNode;
}

const handleMyThemeChange = (theme: string) => {
  switch (theme) {
    case "light":
      return lightTheme;
    case "dark":
      return darkTheme;
    default:
      return lightTheme;
  }
};

export function MyThemeContextProvider({
  children
}: MyThemeContextProviderProps) {
  const [theme, setTheme] = useMyTheme();
  const [clientTheme, setClientTheme] = useState(lightTheme);

  useEffect(() => {
    setClientTheme(handleMyThemeChange(theme));
  }, [theme]);

  return (
    <ThemeProvider theme={clientTheme}>
      <SetMyThemeContext.Provider value={setTheme}>
        {children}
      </SetMyThemeContext.Provider>
    </ThemeProvider>
  );
}
