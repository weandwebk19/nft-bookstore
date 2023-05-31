import { useMemo } from "react";

import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import {
  GridColDef,
  DataGrid as MUIDataGrid,
  enUS,
  viVN
} from "@mui/x-data-grid";
import { useRouter } from "next/router";

interface DataGridProps {
  columns: GridColDef[];
  rows: any[];
  getRowId?: (row: any) => any;
  components?: any;
  config?: any;
}

const DataGrid = ({
  columns,
  rows,
  getRowId,
  components,
  config
}: DataGridProps) => {
  const theme = useTheme();
  const { locale } = useRouter();

  const localeText = useMemo(() => {
    if (locale === "en") {
      return enUS.components.MuiDataGrid.defaultProps.localeText;
    } else if (locale === "vi") {
      return {
        ...viVN.components.MuiDataGrid.defaultProps.localeText,
        columnMenuManageColumns: "Quản lí các cột",
        filterOperatorIsAnyOf: "Một trong số"
      };
    }
  }, [locale]);

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
              pageSize: 10
            }
          }
        }}
        pageSizeOptions={[10]}
        checkboxSelection
        disableRowSelectionOnClick
        getRowHeight={() => "auto"}
        localeText={localeText}
        components={components}
      />
    </Box>
  );
};

export default DataGrid;
