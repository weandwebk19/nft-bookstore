import * as React from "react";

import { GridToolbarExportContainer } from "@mui/x-data-grid";

import { ExportMenuItem } from "./ExportMenuItem";

export function ExportButton(props: any) {
  return (
    <GridToolbarExportContainer {...props}>
      <ExportMenuItem />
    </GridToolbarExportContainer>
  );
}
