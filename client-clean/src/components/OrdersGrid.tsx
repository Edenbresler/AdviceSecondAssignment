import { useCallback, useEffect, useMemo, useState } from "react";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import {
  Card, CardHeader, CardContent, Stack, FormControl, InputLabel,
  Select, MenuItem, type SelectChangeEvent
} from "@mui/material";
import { api } from "../api";
import type { OrderItem } from "../types";

const nowIso = new Date().toISOString();
const MOCK: OrderItem[] = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  orderDate: nowIso,
  requestedDeliveryDate: nowIso,
  shippedDate: nowIso,
  diffMinutes: i === 0 ? 240 : i === 1 ? 180 : i === 2 ? 120 : 10 + i,
  severityRank: i + 1,
}));

export default function OrdersGrid() {
  const [kind, setKind] = useState<"late" | "early">("late");
  const [limit, setLimit] = useState<number>(10);
  const [rows, setRows] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);

  const cols: GridColDef<OrderItem>[] = useMemo(() => [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "orderDate", headerName: "Order Date", flex: 1, minWidth: 160,
      valueFormatter: ({ value }) => value ? new Date(value as string).toLocaleString("en-US") : ""
    },
    {
      field: "requestedDeliveryDate", headerName: "Requested Delivery", flex: 1, minWidth: 180,
      valueFormatter: ({ value }) => value ? new Date(value as string).toLocaleString("en-US") : ""
    },
    {
      field: "shippedDate", headerName: "Shipped At", flex: 1, minWidth: 160,
      valueFormatter: ({ value }) => value ? new Date(value as string).toLocaleString("en-US") : ""
    },
    {
      field: "diffMinutes", headerName: "Delta (min)", type: "number", width: 140,
      renderCell: (p: GridRenderCellParams<OrderItem, number>) => {
        const val = p.value ?? 0;
        const extreme = (p.row.severityRank ?? 99) <= 3;
        const bg = extreme ? (kind === "late" ? "#fecaca" : "#bbf7d0") : "transparent"; // red-200 / green-200
        return <span style={{ padding: "4px 8px", borderRadius: 8, background: bg }}>{val}</span>;
      }
    }
  ], [kind]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<OrderItem[]>("/api/orders/delivery-status", { params: { kind, limit } });
      setRows(data);
    } catch {
      setRows(MOCK.slice(0, limit));
    } finally {
      setLoading(false);
    }
  }, [kind, limit]);

  useEffect(() => { void load(); }, [load]);

  // typed handlers (בלי any)
  const handleKindChange = (e: SelectChangeEvent<"late" | "early">) => {
    setKind(e.target.value as "late" | "early");
  };
  const handleLimitChange = (e: SelectChangeEvent<string>) => {
    setLimit(Number(e.target.value));
  };

  return (
    <Card>
      <CardHeader
        title="Early/Late Orders"
        action={
          <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 260 }}>
            <FormControl size="small">
              <InputLabel id="kind-label">Type</InputLabel>
              <Select<"late" | "early">
                labelId="kind-label"
                label="Type"
                value={kind}
                onChange={handleKindChange}
              >
                <MenuItem value="late">Late (default)</MenuItem>
                <MenuItem value="early">Early</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small">
              <InputLabel id="limit-label">Rows</InputLabel>
              <Select<string>
                labelId="limit-label"
                label="Rows"
                value={String(limit)}
                onChange={handleLimitChange}
              >
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="10">10</MenuItem>
                <MenuItem value="20">20</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        }
      />
      <CardContent>
        <div style={{ height: 420, width: "100%" }}>
          <DataGrid<OrderItem>
            rows={rows}
            columns={cols}
            loading={loading}
            getRowId={(r) => r.id}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 20]}
            initialState={{ pagination: { paginationModel: { pageSize: Math.min(limit, 20) } } }}
          />
        </div>
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
          * The top 3 most extreme rows are highlighted (green = early, red = late).
        </div>
      </CardContent>
    </Card>
  );
}
