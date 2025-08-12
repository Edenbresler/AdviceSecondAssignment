import { useEffect, useState } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Card, CardContent, CardHeader } from "@mui/material";
import { api } from "../api";
import type { TopProduct } from "../types";

type Row = TopProduct & { id: number };

const cols: GridColDef<Row>[] = [
  { field: "productName", headerName: "Product", flex: 1, minWidth: 140 },
  { field: "city", headerName: "City", flex: 1, minWidth: 120 },
  { field: "salesCount", headerName: "Sales Count", type: "number", width: 140 },
];

// In case I don't have a database
const MOCK: TopProduct[] = [
  { productName: "Chai", city: "London", salesCount: 120 },
  { productName: "Chang", city: "London", salesCount: 95 },
  { productName: "Aniseed Syrup", city: "London", salesCount: 80 },
];

export default function TopProductsGrid() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<TopProduct[]>("/api/analytics/top-products");
      setRows(data.map((r, i) => ({ id: i + 1, ...r })));
    } catch {
      setRows(MOCK.map((r, i) => ({ id: i + 1, ...r })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <Card>
      <CardHeader
        title="Top 3 Products (best-selling city per product)"
        
      />
      <CardContent>
        <div style={{ height: 360, width: "100%" }}>
          <DataGrid<Row>
            rows={rows}
            columns={cols}
            loading={loading}
            disableRowSelectionOnClick
            pageSizeOptions={[3]}
            initialState={{ pagination: { paginationModel: { pageSize: 3 } } }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
