import { SvgIconProps } from "@mui/material/SvgIcon";
import { styled } from "@mui/material/styles";

import TreeItem, { TreeItemProps, treeItemClasses } from "@mui/lab/TreeItem";

declare module "react" {
  interface CSSProperties {
    "--tree-view-color"?: string;
    "--tree-view-bg-color"?: string;
  }
}

export type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  labelIcon?: React.ElementType<SvgIconProps>;
  labelInfo?: string;
  labelText: string;
  formName?: string;
};

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`&.tree-item-selected > .${treeItemClasses.content}`]: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.primary.main,

    "&:hover": {
      backgroundColor: theme.palette.background.default
    },
    "&.Mui-selected.Mui-focused": {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.primary.main
    },
    "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.primary.main
    }
  },
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    clipPath:
      "polygon(0% 0%, 100% 0%, calc(100% - 16px) 50%, 100% 100%, 0% 100%)",
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    padding: 0,
    backgroundColor: "inherit",

    "&.Mui-expanded": {
      fontWeight: theme.typography.fontWeightRegular
    },
    "&:hover, .hover2": {
      backgroundColor: theme.palette.action.hover
    },

    "&.Mui-selected.Mui-focused": {
      backgroundColor: theme.palette.background.paper
    },
    "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
      backgroundColor: "inherit"
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: "inherit",
      color: "inherit",
      paddingLeft: 0
    }
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2)
    }
  }
}));

export { StyledTreeItemRoot };
