import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#0f766e" },   // teal
    secondary: { main: "#1d4ed8" }, // blue
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCard: { styleOverrides: { root: { boxShadow: "0 6px 24px rgba(0,0,0,.08)" } } },
  },
  typography: {
    fontFamily: ["Inter","Roboto","Helvetica","Arial","sans-serif"].join(","),
  },
});

export default theme;
