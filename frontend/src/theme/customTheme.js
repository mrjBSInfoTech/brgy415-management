import { createTheme, alpha, lighten, darken } from "@mui/material/styles";
import fontTheme from "./fontTheme.js";

export const isValidColorScheme = (value) =>
  typeof value === "string" && /^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(value.trim());

export const normalizeColorScheme = (value) =>
  isValidColorScheme(value) ? value.trim() : "#1e1f87";

// All brand colors come from the database; status colors retain their meaning.
const createBrandTheme = (base, colorScheme) => {
  const main = normalizeColorScheme(colorScheme);
  const secondary = darken(main, 0.18);
  const accent = lighten(main, 0.3);
  const contrastText = "#ffffff";
  const selected = lighten(main, 0.2);
  const selectedText = "#ffffff";
  return createTheme(base, {
    palette: {
      mode: "light",
      primary: { main, light: lighten(main, 0.25), dark: darken(main, 0.2), contrastText },
      secondary: {
        main: secondary, light: lighten(secondary, 0.25), dark: darken(secondary, 0.2),
        contrastText,
      },
      info: {
        main: accent, light: lighten(accent, 0.25), dark: darken(accent, 0.3),
        contrastText,
      },
      accent: { main: accent, subtle: alpha(main, 0.1) },
      background: { sidebar: main, header: main, footer: main },
      text: { sidebar: contrastText },
      action: {
        hover: alpha(main, 0.08),
        selected: alpha(main, 0.16),
        focus: alpha(main, 0.2),
      },
    },
    sidebar: {
      hover: alpha(lighten(main, 0.65), 0.3),
      selected,
      selectedHover: lighten(main, 0.25),
      selectedText,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: ({ ownerState }) => ({
            textTransform: "none",
            borderRadius: 8,
            fontWeight: 500,
            ...(ownerState.variant === "contained" ? {
              color: contrastText,
              "&:hover, &:active, &:focus-visible": { color: contrastText },
              "& .MuiSvgIcon-root": { color: "inherit" },
            } : {}),
          }),
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            color: contrastText,
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: ({ theme }) => ({
            "&.Mui-selected": { backgroundColor: theme.palette.action.selected },
            "&.Mui-selected:hover": { backgroundColor: alpha(main, 0.24) },
          }),
        },
      },
    },
  });
};

export const createPrivateTheme = (colorScheme) => createBrandTheme(privateBaseTheme, colorScheme);

export const createPublicTheme = (colorScheme) => createBrandTheme(fontTheme, colorScheme);

const privateBaseTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1e1f87",
      light: "#3f51b5",
      dark: "#1a237e",
    },
    secondary: {
      main: "#6b7280",
      light: "#9ca3af",
      dark: "#4b5563",
    },
    warning: {
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#b45309",
    },
    success: {
      main: "#22c55e",
      light: "#4ade80",
      dark: "#16a34a",
    },
    error: {
      main: "#dc2626",
      light: "#ef4444",
      dark: "#b91c1c",
    },
    background: {
      default: "#ffffff",
      paper: "#f8fafc",
      table : "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#475569",
      disabled: "#94a3b8",
      sidebar: "#ffffff",
    },
    divider: "#e2e8f0",
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});
