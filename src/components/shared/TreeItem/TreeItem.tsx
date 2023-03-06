import { Box, Typography } from "@mui/material";

import Label from "@mui/icons-material/Label";

import {
  StyledTreeItemProps,
  StyledTreeItemRoot
} from "@/styles/components/TreeView/StyledTreeView";

const TreeItem = (props: StyledTreeItemProps) => {
  const {
    bgColor,
    color,
    labelIcon = Label,
    labelInfo,
    labelText,
    ...other
  } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box
          sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0, pl: 0 }}
        >
          <Box component={Label} color="inherit" sx={{ mr: 1 }} />
          {/* <Box
                        component="img"
                        src={images.artPhotography}
                        alt="NFT Bookstore"
                        sx={{
                        width: "18px",
                        mr: 1,
                        }}
                    /> */}

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
      {...other}
    />
  );
};

export default TreeItem;
