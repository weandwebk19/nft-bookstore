import {
  FieldValues,
  UseFormGetValues,
  UseFormSetValue
} from "react-hook-form/dist/types";

import { Box, Typography } from "@mui/material";

import Label from "@mui/icons-material/Label";

import {
  StyledTreeItemProps,
  StyledTreeItemRoot
} from "@/styles/components/TreeView/StyledTreeView";

const TreeItem = (
  props: StyledTreeItemProps & {
    setValue: UseFormSetValue<FieldValues>;
    getValues: UseFormGetValues<FieldValues>;
    handleClick: (nodeId: string) => void;
  }
) => {
  const {
    bgColor,
    color,
    labelIcon = Label,
    labelInfo,
    labelText,
    formName,
    setValue,
    getValues,
    handleClick = () => {},
    ...other
  } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box
          sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0, pl: 0 }}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            handleClick(other.nodeId);
          }}
        >
          <Box component={Label} color="inherit" sx={{ mr: 1 }} />
          <Typography
            variant="body2"
            sx={{ fontWeight: "inherit", flexGrow: 1 }}
          >
            {labelText}
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontWeight: "inherit", flexGrow: 1 }}
          >
            {labelInfo}
          </Typography>
        </Box>
      }
      style={{
        "--tree-view-color": color,
        "--tree-view-bg-color": bgColor
      }}
      className={`${
        typeof formName === "string" &&
        getValues(formName).includes(other.nodeId)
          ? "tree-item-selected"
          : ""
      }`}
      {...other}
    />
  );
};

export default TreeItem;
