import { useState } from "react";

import { Avatar, Badge, Chip, IconButton, Stack, Tooltip } from "@mui/material";

import AdjustIcon from "@mui/icons-material/Adjust";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

import { StyledButton } from "@styles/components/Button";
import PropTypes from "prop-types";

import { truncate } from "@/utils/truncate";

import { AccountMenu } from "../AccountMenu";

interface WalletBarProps {
  isInstalled: boolean;
  isLoading: boolean;
  account?: string;
  connect(...args: unknown[]): unknown;
  disconnect(...args: unknown[]): unknown;
}

const WalletBar = ({
  isInstalled,
  isLoading,
  connect,
  account,
  disconnect
}: WalletBarProps) => {
  const [anchorAccountMenu, setAnchorAccountMenu] = useState<Element | null>(
    null
  );
  const openAccountMenu = Boolean(anchorAccountMenu);

  const handleAccountMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorAccountMenu(e.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAnchorAccountMenu(null);
  };

  if (isLoading)
    return <StyledButton customVariant="secondary">Loading...</StyledButton>;

  if (account)
    return (
      <Stack direction="row" alignItems="center" sx={{ flexGrow: 0 }}>
        <Stack
          direction="row"
          alignItems="center"
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <Chip
            avatar={<AdjustIcon />}
            label={truncate(account, 6, -4)}
            variant="outlined"
          />
          <Tooltip title="Account menu">
            <IconButton onClick={handleAccountMenuClick}>
              <Avatar alt="Remy Sharp" src="" />
            </IconButton>
          </Tooltip>
        </Stack>
        <AccountMenu
          account={account}
          open={openAccountMenu}
          onClose={handleAccountMenuClose}
          disconnect={() => {
            disconnect();
          }}
        />
        <Tooltip title="Shopping bag">
          <IconButton>
            <Badge badgeContent={3} color="secondary">
              <ShoppingBagOutlinedIcon color="primary" />
            </Badge>
          </IconButton>
        </Tooltip>
      </Stack>
    );

  if (isInstalled) {
    return (
      <StyledButton
        customVariant="primary"
        onClick={() => {
          connect();
        }}
      >
        Connect wallet
      </StyledButton>
    );
  } else {
    return (
      <StyledButton
        customVariant="secondary"
        onClick={() => {
          window.open("https://metamask.io", "_ blank");
        }}
      >
        No Wallet
      </StyledButton>
    );
  }
};

WalletBar.propTypes = {
  isInstalled: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  account: PropTypes.string,
  connect: PropTypes.func.isRequired
};

WalletBar.defaultProps = {
  account: ""
};

export default WalletBar;
