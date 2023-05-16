import { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Chip,
  FormHelperText,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  Stack,
  Tooltip
} from "@mui/material";

import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AdjustIcon from "@mui/icons-material/Adjust";
import ControlPointIcon from "@mui/icons-material/ControlPoint";

// import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { List as CustomList } from "@shared/List";
import { StyledButton } from "@styles/components/Button";
import { getCsrfToken } from "next-auth/react";
import { signOut, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import PropTypes from "prop-types";
import { useConnect } from "wagmi";

import images from "@/assets/images";
import { Dialog } from "@/components/shared/Dialog";
import { StyledChip } from "@/styles/components/Chip";
import { ListItemProps } from "@/types/list";
import { truncate } from "@/utils/truncate";

import { AccountMenu } from "../AccountMenu";

interface WalletBarProps {
  isInstalled: boolean;
  isLoading: boolean;
  account?: string;
  userName?: string;
  avatar?: string;
  handleLogin: () => Promise<void>;
  disconnect(...args: unknown[]): unknown;
  isConnected: boolean;
  isAuthor: boolean;
}

const WalletBar = ({
  isInstalled,
  isLoading,
  account,
  userName,
  avatar,
  handleLogin,
  disconnect,
  isConnected,
  isAuthor
}: WalletBarProps) => {
  const { t } = useTranslation();
  const { data, status } = useSession();
  const [address, setAddress] = useState(data?.address as string);
  const { connect, connectors, error, pendingConnector } = useConnect();

  const [anchorWalletCard, setAnchorWalletCard] = useState<Element | null>(
    null
  );
  const openWalletCard = Boolean(anchorWalletCard);

  const createList: ListItemProps[] = [
    {
      type: "button",
      icon: null,
      content: "Create Listing",
      onClick: () => handleCreateListingClick(),
      disabled: false,
      subList: []
    },
    {
      type: "button",
      icon: null,
      content: "Create Rental",
      onClick: () => handleCreateRentalClick(),
      disabled: false,
      subList: []
    }
  ];

  const [anchorAccountMenu, setAnchorAccountMenu] = useState<Element | null>(
    null
  );
  const openAccountMenu = Boolean(anchorAccountMenu);

  const [anchorCreateMenu, setAnchorCreateMenu] = useState<Element | null>(
    null
  );
  const openCreateMenu = Boolean(anchorCreateMenu);

  const handleAccountMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorAccountMenu(e.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAnchorAccountMenu(null);
  };

  const handleCreateMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorCreateMenu(e.currentTarget);
  };

  const handleCreateMenuClose = () => {
    setAnchorCreateMenu(null);
  };

  const handleCreateListingClick = () => {
    alert("Create Listing");
  };

  const handleCreateRentalClick = () => {
    alert("Create Rental");
  };

  const handleWalletCardClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorWalletCard(e.currentTarget);
  };

  const handleWalletCardClose = () => {
    setAnchorWalletCard(null);
  };

  useEffect(() => {
    if (account) {
      setAddress(account);
    }
  }, [account]);

  useEffect(() => {
    if (data?.address) {
      setAddress(data.address);
    }
  }, [data]);

  if (isLoading)
    return <StyledButton customVariant="secondary">Loading...</StyledButton>;

  if (address && account)
    return (
      <Stack direction="row" alignItems="center" sx={{ flexGrow: 0 }}>
        <Stack
          direction="row"
          alignItems="center"
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          {isAuthor ? (
            <StyledChip
              icon={<AdjustIcon color="primary" />}
              label={truncate(account ? account : "", 6, -4)}
              background={images.gradient1}
            />
          ) : (
            <Chip
              avatar={<AdjustIcon />}
              label={truncate(account ? account : "", 6, -4)}
              variant="outlined"
            />
          )}
          <Tooltip title={t("navbar:toolTip_accountMenu")}>
            <IconButton onClick={handleAccountMenuClick}>
              <Avatar alt="Remy Sharp" src="" />
            </IconButton>
          </Tooltip>
        </Stack>
        <AccountMenu
          account={account}
          userName={userName}
          avatar={avatar}
          open={openAccountMenu}
          onClose={handleAccountMenuClose}
          disconnect={() => {
            disconnect();
            signOut({
              redirect: false
            });
          }}
          isAuthor={isAuthor}
        />
        <Box
          sx={{
            display: {
              sm: "flex",
              md: "none"
            }
          }}
        >
          <Tooltip title="Create listing/rental">
            <IconButton onClick={(e) => handleCreateMenuClick(e)}>
              <ControlPointIcon color="primary" />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorCreateMenu}
            id="create-menu"
            open={openCreateMenu}
            onClose={handleCreateMenuClose}
            disableScrollLock={true}
            // onClick={handleSettingsMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0
                }
              }
            }}
            transformOrigin={{
              horizontal: "right",
              vertical: "top"
            }}
            anchorOrigin={{
              horizontal: "right",
              vertical: "bottom"
            }}
          >
            <CustomList items={createList} />
          </Menu>
        </Box>
        {/* <Tooltip title={t("navbar:toolTip_shoppingBag")}>
          <IconButton>
            <Badge badgeContent={3} color="secondary">
              <ShoppingBagOutlinedIcon color="primary" />
            </Badge>
          </IconButton>
        </Tooltip> */}
      </Stack>
    );

  if (isInstalled) {
    return (
      <>
        <StyledButton
          customVariant="primary"
          onClick={handleWalletCardClick}
          sx={{
            display: {
              xs: "none",
              sm: "flex"
            }
          }}
        >
          {t("navbar:connectWallet")}
        </StyledButton>
        <IconButton
          onClick={handleWalletCardClick}
          sx={{
            display: {
              xs: "flex",
              sm: "none",
              md: "none"
            }
          }}
        >
          <AccountBalanceWalletOutlinedIcon color="primary" />
        </IconButton>

        <Dialog
          title={t("navbar:connectWallet")!}
          open={openWalletCard}
          onClose={handleWalletCardClose}
        >
          <Grid item xs={4} md={6}>
            <List
              sx={{
                border: "1px solid ",
                borderRadius: "5px"
              }}
            >
              {connectors.map((connector) => (
                <Box key={connector.id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      disabled={!connector.ready}
                      onClick={() => {
                        if (!isConnected) {
                          connect({ connector });
                        } else {
                          handleLogin();
                        }
                      }}
                    >
                      <ListItemText
                        primary={`${connector.name}${
                          !connector.ready ? " (unsupported)" : ""
                        }${
                          isLoading && connector.id === pendingConnector?.id
                            ? " (connecting)"
                            : ""
                        }`}
                      />
                    </ListItemButton>
                  </ListItem>
                </Box>
              ))}
            </List>

            {error && (
              <FormHelperText
                error
                sx={{ marginTop: "24px", fontSize: "14px" }}
              >
                {error.message}
              </FormHelperText>
            )}
          </Grid>
        </Dialog>
      </>
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
  account: PropTypes.string
  // connect: PropTypes.func.isRequired
};

WalletBar.defaultProps = {
  account: ""
};

export default WalletBar;

export async function getServerSideProps(context: any) {
  return {
    props: {
      csrfToken: await getCsrfToken(context)
    }
  };
}
