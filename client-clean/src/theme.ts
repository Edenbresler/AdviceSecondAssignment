// src/theme.ts
import { createTheme, alpha } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";

export default function makeTheme(mode: PaletteMode) {
  const isDark = mode === "dark";

  const primary = {
    main: "#5B6CFF",
    light: "#8C97FF",
    dark: "#3A46B6",
    contrastText: "#ffffff",
  };

  const secondary = {
    main: "#00BFA6",
    light: "#4CE3D2",
    dark: "#009581",
    contrastText: "#052A27",
  };

  const success = { main: "#23C55E" };
  const error   = { main: "#EF4444" };
  const warning = { main: "#F59E0B" };
  const info    = { main: "#3B82F6" };

  return createTheme({
    palette: {
      mode,
      primary,
      secondary,
      success,
      error,
      warning,
      info,
      background: {
        default: isDark ? "#0f1220" : "#F6F7FB",
        paper:   isDark ? "#151a2d" : "#FFFFFF",
      },
      divider: isDark ? alpha("#ffffff", 0.12) : alpha("#1F2937", 0.12),
    },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily: `"Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"`,
      h5: { fontWeight: 800, letterSpacing: "-0.2px" },
      h6: { fontWeight: 700 },
      button: { fontWeight: 700, textTransform: "none", letterSpacing: 0.2 },
      subtitle2: { color: isDark ? "#B6C3D3" : "#64748B" },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: isDark
              ? "radial-gradient(1200px 600px at 10% -10%, rgba(91,108,255,0.12), transparent), radial-gradient(1000px 500px at 90% -10%, rgba(0,191,166,0.10), transparent)"
              : "radial-gradient(1200px 600px at 10% -10%, rgba(91,108,255,0.10), transparent), radial-gradient(1000px 500px at 90% -10%, rgba(0,191,166,0.08), transparent)",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            boxShadow: isDark
              ? "0 6px 30px rgba(0,0,0,0.35)"
              : "0 8px 30px rgba(17, 24, 39, 0.08)",
            transition: "transform .2s ease, box-shadow .2s ease",
            ":hover": {
              transform: "translateY(-2px)",
              boxShadow: isDark
                ? "0 12px 36px rgba(0,0,0,0.45)"
                : "0 12px 36px rgba(17, 24, 39, 0.12)",
            },
          },
        },
      },
      MuiButton: {
        defaultProps: { disableRipple: true },
        styleOverrides: {
          root: { borderRadius: 12, paddingInline: 14 },
          containedPrimary: { boxShadow: "0 6px 16px rgba(91,108,255,0.35)" },
          containedSecondary: { boxShadow: "0 6px 16px rgba(0,191,166,0.30)" },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: "saturate(1.2) blur(8px)",
            backgroundImage: isDark
              ? "linear-gradient(90deg, rgba(21,26,45,0.9), rgba(21,26,45,0.9))"
              : "linear-gradient(90deg, rgba(255,255,255,0.85), rgba(255,255,255,0.85))",
            borderBottom: `1px solid ${isDark ? alpha("#ffffff", 0.08) : alpha("#1F2937", 0.08)}`,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 700, letterSpacing: 0.3 },
        },
      },
    },
  });
}