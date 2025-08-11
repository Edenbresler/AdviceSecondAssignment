import { useEffect, useMemo, useRef, useState } from "react";
import { keyframes } from "@mui/system";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import { alpha } from "@mui/material/styles";

// אנימציית pulse לצ'יפ של הטיימר
const pulse = keyframes`
  0%   { transform: scale(1);   box-shadow: 0 0 0 0 rgba(99,102,241,.4); }
  70%  { transform: scale(1.03);box-shadow: 0 0 0 10px rgba(99,102,241,0); }
  100% { transform: scale(1);   box-shadow: 0 0 0 0 rgba(99,102,241,0); }
`;
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Switch,
  FormControlLabel,
  Box,
  Chip,
  Stack
} from "@mui/material";
import TopProductsGrid from "./components/TopProductsGrid";
import OrdersGrid from "./components/OrdersGrid";
import ServerDialog from "./components/ServerDialog";
import { API_BASE } from "./api";
import * as signalR from "@microsoft/signalr";
import type { PaletteMode } from "@mui/material";
import makeTheme from "./theme";
import bgImg from "./assets/bg.jpg"; 

export default function App() {
  // Theme mode (light/dark)
  const [mode, setMode] = useState<PaletteMode>(
    (localStorage.getItem("ui.mode") as PaletteMode) || "light"
  );

  // Create theme when mode changes
  const theme = useMemo(() => makeTheme(mode), [mode]);

  // timer with persistence
  const [elapsed, setElapsed] = useState(0);
  const [persist, setPersist] = useState(
    () => localStorage.getItem("timer.persist") === "1"
  );
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    const saved = Number(localStorage.getItem("timer.start") || "0");
    if (persist && saved > 0) startRef.current = saved;
    else {
      startRef.current = Date.now();
      localStorage.setItem("timer.start", String(startRef.current));
    }
    const t = setInterval(
      () => setElapsed(Date.now() - startRef.current),
      1000
    );
    return () => clearInterval(t);
  }, [persist]);

  useEffect(() => {
    localStorage.setItem("timer.persist", persist ? "1" : "0");
    if (!persist) {
      startRef.current = Date.now();
      localStorage.setItem("timer.start", String(startRef.current));
      setElapsed(0);
    }
  }, [persist]);

  const hhmmss = useMemo(() => {
    const sec = Math.floor(elapsed / 1000);
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }, [elapsed]);

  // SignalR dialog
  const [dialogMsg, setDialogMsg] = useState<string | null>(null);
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE}/hubs/notifications`)
      .withAutomaticReconnect()
      .build();

    connection.on("serverMessage", (message: string) =>
      setDialogMsg(message)
    );
    connection.start().catch(() => {
      /* ignore while API is down */
    });
    return () => {
      connection.stop();
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
<Box
      sx={{
        minHeight: "100vh",
        position:"relative",
        backgroundImage: `url(${bgImg})`,  
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      backgroundColor: "rgba(255, 255, 255, 0.6)", // לבן שקוף - אפשר גם לשים "rgba(0,0,0,0.4)" בשביל כהה
      zIndex: 0,},
  }}
>
<AppBar
  position="sticky"
  elevation={0}
  sx={{
    bgcolor: "transparent",
    backdropFilter: "saturate(180%) blur(10px)",
    borderBottom: (t) => `1px solid ${alpha(t.palette.divider, 0.4)}`,
  }}
>
<Toolbar
  sx={{
    display: "flex",
    justifyContent: "space-between",
    gap: 2,
    color: "text.primary",            // ← הוסף שורה זו
  }}
>
    {/* כותרת עם גרדיאנט עדין */}
<Typography
  variant="h5"
  sx={(theme) => ({
    fontWeight: 800,
    letterSpacing: 0.2,
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(90deg,#A5B4FC 0%, #67E8F9 40%, #6EE7B7 80%)"
        : "linear-gradient(90deg,#4F46E5 0%, #06B6D4 40%, #059669 80%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  })}
>
  Sales & Orders Dashboard
</Typography>

    <Stack direction="row" spacing={3} alignItems="center">
      {/* ה־pulse כאן משתמש ב־keyframes שהגדרת */}
      <Chip
        label={hhmmss}
        color="secondary"
        sx={{ fontWeight: 700, animation: `${pulse} 2.5s ease-in-out infinite` }}
      />

      <FormControlLabel
        control={<Switch checked={persist} onChange={(_, v) => setPersist(v)} />}
        label="Persist after refresh?"
      />

     
      <FormControlLabel
        control={
          <Switch
            checked={mode === "dark"}
            onChange={(_, checked) => setMode(checked ? "dark" : "light")}
          />
        }
        label="Dark mode"
      />
    </Stack>
  </Toolbar>
</AppBar>

<Container maxWidth="lg" sx={{ py: 4 }}>
  {/* שתי “קופסאות זכוכית” עם אנימציית כניסה */}
  <Stack spacing={3}>
    <Grow in timeout={600}>
      <Paper
        elevation={0}
        sx={(t) => ({
          p: 2.5,
          borderRadius: 3,
          background:
            t.palette.mode === "dark"
              ? "rgba(15,15,15,0.55)"
              : "rgba(255,255,255,0.6)",
          backdropFilter: "blur(10px)",
          border: `1px solid ${alpha(t.palette.divider, 0.5)}`,
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.15)",
        })}
      >
        <TopProductsGrid />
      </Paper>
    </Grow>

    <Grow in timeout={800}>
      <Paper
        elevation={0}
        sx={(t) => ({
          p: 2.5,
          borderRadius: 3,
          background:
            t.palette.mode === "dark"
              ? "rgba(15,15,15,0.55)"
              : "rgba(255,255,255,0.6)",
          backdropFilter: "blur(10px)",
          border: `1px solid ${alpha(t.palette.divider, 0.5)}`,
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.15)",
        })}
      >
        <OrdersGrid />
      </Paper>
    </Grow>
  </Stack>

  <Box sx={{ mt: 2, color: "text.secondary", fontSize: 12 }}>
    * Built according to the assignment requirements: UI in a single
    responsive page, top-3 products by city, early/late orders with
    5/10/20, timer + persistence, and SignalR dialog from server.
  </Box>
</Container>

      <ServerDialog
        open={!!dialogMsg}
        message={dialogMsg}
        onClose={() => setDialogMsg(null)}
      />
      </Box>
    </ThemeProvider>
  );
}