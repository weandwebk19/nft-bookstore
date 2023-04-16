import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { GridColDef, DataGrid as MUIDataGrid } from "@mui/x-data-grid";

interface DataGridProps {
  columns: GridColDef[];
  rows: any[];
  getRowId?: (row: any) => any;
}

const DataGrid = ({ columns, rows, getRowId }: DataGridProps) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: "100%",
        "& .MuiDataGrid-columnHeaders": {
          height: "50px",
          backgroundColor: theme.palette.background.default,
          color: theme.palette.primary.main
        },
        "& .MuiDataGrid-columnSeparator": {
          display: "none"
        },
        "& .MuiDataGrid-columnHeaderTitle": {
          lineHeight: "1.5 !important",
          fontWeight: "bold"
        },
        "& .MuiDataGrid-cell:focus": {
          outline: "none !important"
        },
        "& .MuiDataGrid-cell:focus-within": {
          outline: "none !important"
        }
      }}
    >
      <MUIDataGrid
        getRowId={getRowId}
        autoHeight
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5
            }
          }
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        getRowHeight={() => "auto"}
      />
    </Box>
  );
};

export default DataGrid;
