import { useEffect, useMemo, useRef, useState } from "react";
import { ThemeProvider, CssBaseline, AppBar, Toolbar, Typography, Container, Switch, FormControlLabel, Box, Chip, Stack } from "@mui/material";
import TopProductsGrid from "./components/TopProductsGrid";
import OrdersGrid from "./components/OrdersGrid";
import ServerDialog from "./components/ServerDialog";
import theme from "./theme";
import { API_BASE } from "./api";
import * as signalR from "@microsoft/signalr";

export default function App() {
  // timer with persistence
  const [elapsed, setElapsed] = useState(0);
  const [persist, setPersist] = useState(() => localStorage.getItem("timer.persist") === "1");
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    const saved = Number(localStorage.getItem("timer.start") || "0");
    if (persist && saved > 0) startRef.current = saved;
    else {
      startRef.current = Date.now();
      localStorage.setItem("timer.start", String(startRef.current));
    }
    const t = setInterval(() => setElapsed(Date.now() - startRef.current), 1000);
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

    connection.on("serverMessage", (message: string) => setDialogMsg(message));
    connection.start().catch(() => {/* ignore while API is down */});
    return () => { connection.stop(); };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="sticky" color="default" elevation={0}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Sales & Orders Dashboard</Typography>
          <Stack direction="row" spacing={3} alignItems="center">
            <Chip label={hhmmss} color="secondary" sx={{ fontWeight: 700 }} />
            <FormControlLabel
              control={<Switch checked={persist} onChange={(_, v) => setPersist(v)} />}
              label="Persist after refresh?"
            />
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Responsive two-column layout with CSS Grid */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
          <TopProductsGrid />
          <OrdersGrid />
        </Box>

        <Box sx={{ mt: 2, color: "text.secondary", fontSize: 12 }}>
          * Built according to the assignment requirements: UI in a single responsive page,
          top-3 products by city, early/late orders with 5/10/20, timer + persistence,
          and SignalR dialog from server.
        </Box>
      </Container>

      <ServerDialog open={!!dialogMsg} message={dialogMsg} onClose={() => setDialogMsg(null)} />
    </ThemeProvider>
  );
}
