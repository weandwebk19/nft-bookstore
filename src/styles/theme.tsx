import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeText {
    hint: string;
  }
  interface TypeBackground {
    appbar: string;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    label: true;
  }
}

const typography = {
  body1: {
    fontFamily: '"Raleway", "Helvetica", "Arial", sans-serif'
  },
  fontFamily: '"Raleway", "Helvetica", "Arial", sans-serif',
  h1: {
    fontFamily: '"Fraunces", "Helvetica", "Arial", serif',
    fontVariationSettings: '"wght" 400, "SOFT" 20, "WONK" 1'
  },
  h2: {
    fontFamily: '"Fraunces", "Helvetica", "Arial", serif',
    fontVariationSettings: '"opsz" 60,"wght" 400, "WONK" 1'
  },
  h3: {
    fontFamily: '"Fraunces", "Helvetica", "Arial", serif',
    fontVariationSettings: '"wght" 100, "SOFT" 20, "WONK" 1'
  },
  h4: {
    fontFamily: '"Fraunces", "Helvetica", "Arial", serif',
    fontVariationSettings: '"wght" 400, "SOFT" 20, "WONK" 1'
  },
  h5: {
    fontFamily: '"Fraunces", "Helvetica", "Arial", serif',
    fontVariationSettings: '"wght" 400, "SOFT" 20, "WONK" 1'
  },
  h6: {
    fontFamily: '"Fraunces", "Helvetica", "Arial", serif',
    fontVariationSettings: '"wght" 400, "SOFT" 20, "WONK" 1'
  },
  label: {
    fontWeight: 700,
    fontSize: "1rem",
    lineHeight: 1.5
  },
  subtitle2: {
    fontWeight: 700,
    fontSize: "0.8rem"
  },
  button: {
    fontWeight: 700,
    letterSpacing: "0.015rem"
  }
};

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    common: {
      black: "#271900",
      white: "#E1DDC4"
    },
    primary: {
      main: "#271900",
      light: "#5e4100",
      contrastText: "#F8EFE7"
    },
    secondary: {
      main: "#006684",
      contrastText: "#F8EFE7"
    },
    background: {
      paper: "#FFF8F3",
      default: "#eae1d9",
      appbar: "rgba(234, 225, 217,0.8)"
    },
    text: {
      primary: "rgba(31,27,22,0.87)",
      secondary: "rgba(31,27,22,0.54)",
      disabled: "rgba(31,27,22,0.38)",
      hint: "rgba(31,27,22,0.38)"
    },
    error: {
      main: "#BA1A1A",
      contrastText: "#F8EFE7"
    },
    info: {
      main: "#006684",
      contrastText: "#F8EFE7"
    },
    success: {
      main: "#657E5B",
      contrastText: "#F8EFE7"
    }
  },
  typography
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    common: {
      black: "#271900",
      white: "#E1DDC4"
    },
    primary: {
      main: "#F8EFE7",
      light: "#FFFBFF",
      contrastText: "#271900"
    },
    secondary: {
      main: "#006684",
      contrastText: "#F8EFE7"
    },
    background: {
      default: "#34302A",
      paper: "#1f1b16",
      appbar: "rgba(31, 27, 22,0.8)"
    },
    text: {
      primary: "#fdefdd",
      secondary: "rgba(253,239,221,0.7)",
      disabled: "rgba(253,239,221,0.5)",
      hint: "rgba(253,239,221,0.5)"
    },
    success: {
      main: "#657E5B"
    },
    error: {
      main: "#CF6679"
    },
    info: {
      main: "#006684"
    }
  },
  typography
});
