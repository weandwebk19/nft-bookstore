import { useState } from "react";

import { Box, Drawer as MUIDrawer } from "@mui/material";

import PropTypes from "prop-types";

interface DrawerProps {
  children: React.ReactNode;
  anchor?: "left" | "right" | "top" | "bottom" | undefined;
  open: boolean;
  onClose(...args: unknown[]): unknown;
  selfClose?: boolean;
}

const Drawer = ({
  children,
  anchor,
  open,
  onClose,
  selfClose
}: DrawerProps) => {
  const [direction, setDirection] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false
  });

  const handleClose = (anchor: any, isOpen: boolean) => () => {
    onClose(false);
    // if (e && e.type === "keydown" && (e.key === "Tab" || e.key === "Shift")) {
    //   return;
    // }

    setDirection({ ...direction, [anchor]: isOpen });
  };

  return (
    <MUIDrawer
      anchor={anchor}
      open={open}
      onClose={handleClose(anchor, false)}
      disableScrollLock={true}
    >
      {selfClose ? (
        <Box onClick={handleClose(anchor, false)}>{children}</Box>
      ) : (
        <Box>{children}</Box>
      )}
    </MUIDrawer>
  );
};

Drawer.propTypes = {
  children: PropTypes.node.isRequired,
  anchor: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selfClose: PropTypes.bool
};

Drawer.defaultProps = {
  anchor: "left",
  selfClose: false
};

export default Drawer;
