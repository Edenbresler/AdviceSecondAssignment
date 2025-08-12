import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  type GridValidRowModel,
} from "@mui/x-data-grid";
import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { api } from "../api";


export type OrderItem = {
  id: number;
  orderDate: string;
  requestedDeliveryDate: string;
  shippedDate: string;
  diffDays: number;
  severityRank: number;
};

// Row type for the grid
type Row = OrderItem & GridValidRowModel;

// Date formatter (safe)
const fmt = (d: string) => {
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? d : dt.toLocaleDateString();
};

export default function OrdersGrid() {
  const [kind, setKind] = useState<"late" | "early">("late");
  const [limit, setLimit] = useState<number>(10);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<OrderItem[]>("/api/orders/delivery-status", {
        params: { kind, limit },
      });
      
      setRows(data);
    } finally {
      setLoading(false);
    }
  }, [kind, limit]);

  useEffect(() => {
    load();
  }, [load]);

  
  const columns: GridColDef<Row>[] = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 80, type: "number" },

      {
        field: "orderDate",
        headerName: "Order Date",
        flex: 1,
        minWidth: 140,
        renderCell: (p: GridRenderCellParams<Row>) => (
          <span>{fmt(p.row.orderDate)}</span>
        ),
      },
      {
        field: "requestedDeliveryDate",
        headerName: "Requested Delivery",
        flex: 1,
        minWidth: 160,
        renderCell: (p: GridRenderCellParams<Row>) => (
          <span>{fmt(p.row.requestedDeliveryDate)}</span>
        ),
      },
      {
        field: "shippedDate",
        headerName: "Shipped At",
        flex: 1,
        minWidth: 140,
        renderCell: (p: GridRenderCellParams<Row>) => (
          <span>{fmt(p.row.shippedDate)}</span>
        ),
      },

      {
        field: "diffMinutes",
        headerName: "Delta (days)",
        type: "number",
        width: 130,
        renderCell: (p: GridRenderCellParams<Row>) => {
          const val = p.row.diffMinutes ?? 0;
          const isTop3 = (p.row.severityRank ?? 99) <= 3;

          
          const bg =
            kind === "late"
              ? isTop3
                ? "bg-red-100"
                : ""
              : isTop3
              ? "bg-green-100"
              : "";

          return (
            <span
              style={{
                display: "inline-block",
                width: "100%",
                textAlign: "right",
                padding: "4px 8px",
                borderRadius: 8,
                background: bg,
              }}
            >
              {val}
            </span>
          );
        },
      },
    ],
    [kind]
  );

  return (
    <Card>
      <CardHeader
        title="Early/Late Orders"
         sx={{ 
        color: "#4fb78aff", 
        fontWeight: "bold", 
        
      }}
        action={
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2">Type</Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select<"late" | "early">
                  value={kind}
                  onChange={(e) => setKind(e.target.value as "early" | "late")}
                >
                  <MenuItem value="late">Late (default)</MenuItem>
                  <MenuItem value="early">Early</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2">Rows</Typography>
              <FormControl size="small" sx={{ minWidth: 72 }}>
                <Select<number>
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        }
      />

      <CardContent>
        <div style={{ height: 460, width: "100%" }}>
        <DataGrid<Row>
          rows={rows}
          columns={columns}
          getRowId={(r) => r.id}
          loading={loading}
          disableRowSelectionOnClick
          density="compact"
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: { paginationModel: { pageSize: Math.min(limit, 20) } },
          }}
      
          getRowClassName={(p) => {
            const isTop3 = (p.row.severityRank ?? 99) <= 3;
            if (!isTop3) return "";
            return kind === "late" ? "row-late" : "row-early";
          }}
          sx={{
           
            "& .row-late":  { backgroundColor: "rgba(244, 67, 54, 0.14)" },   
            "& .row-early": { backgroundColor: "rgba(76, 175, 80, 0.14)" },   
            "& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader": { paddingX: 1 },
          }}
        />

        </div>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          * The top 3 most extreme rows are highlighted (green = early, red = late).
        </Typography>
      </CardContent>
    </Card>
  );
}