import * as React from "react";

import { Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { StyledMenu } from "@/styles/components/Menu";
import { ListItemProps } from "@/types/list";

interface DropdownMenuProps {
  tooltipTitle?: string;
  buttonVariant?: "contained" | "text" | "outlined" | undefined;
  buttonName: string | React.ReactNode;
  items: ListItemProps[];
}

export default function DropdownMenu({
  tooltipTitle,
  buttonVariant = "contained",
  buttonName,
  items
}: DropdownMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Tooltip title={tooltipTitle}>
        <Button
          id="demo-customized-button"
          aria-controls={open ? "demo-customized-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          disableElevation
          onClick={handleClick}
          endIcon={<KeyboardArrowDownIcon />}
          variant={buttonVariant}
        >
          {buttonName}
        </Button>
      </Tooltip>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button"
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {items.map((item) => (
          <MenuItem key={item.content} onClick={item.onClick}>
            {item.icon && item.icon}
            {item.content}
          </MenuItem>
        ))}
      </StyledMenu>
    </div>
  );
}
