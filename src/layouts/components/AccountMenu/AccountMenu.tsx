import {
  Avatar,
  Box,
  Divider,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import PropTypes from "prop-types";
import { Dialog } from "@shared/Dialog";
import { StyledButton } from "@styles/components/Button";
import { truncate } from "@/utils/truncate";

interface AccountMenuProps {
  account?: string;
  open: boolean;
  onClose(...args: unknown[]): unknown;
}

const AccountMenu = ({ account, open, onClose }: AccountMenuProps) => {
  const accountItems = [
    {
      icon: <PermIdentityOutlinedIcon color="primary" fontSize="small" />,
      content: "My Profile",
      onClick: () => {
        console.log("My Profile");
      },
    },
    {
      icon: <BookmarkBorderOutlinedIcon color="primary" fontSize="small" />,
      content: "Favorites",
      onClick: () => {
        console.log("Favorites");
      },
    },
    {
      icon: <VisibilityOutlinedIcon color="primary" fontSize="small" />,
      content: "Watchlist",
      onClick: () => {
        console.log("Watchlist");
      },
    },
    {
      icon: (
        <CollectionsBookmarkOutlinedIcon color="primary" fontSize="small" />
      ),
      content: "My Collections",
      onClick: () => {
        console.log("Collection");
      },
    },
    {
      icon: <LogoutOutlinedIcon color="primary" fontSize="small" />,
      content: "Disconnect",
      onClick: () => {
        console.log("Disconnect");
      },
    },
  ];

  return (
    <Dialog title="Account" open={open} onClose={onClose}>
      <Grid container spacing={3} columns={{ xs: 4, sm: 4, md: 12 }}>
        <Grid item xs={4} md={6}>
          <Stack
            sx={{ flexGrow: 1 }}
            justifyContent="space-between"
            height="100%"
            spacing={3}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{
                border: "1px solid ",
                borderRadius: "5px",
                padding: 3,
              }}
            >
              <Stack
                alignItems="center"
                sx={{
                  flexDirection: { xs: "column", md: "row" },
                }}
              >
                <Avatar
                  alt="Tho Le"
                  src="TL"
                  sx={{
                    width: 56,
                    height: 56,
                    mr: { xs: 0, md: 2 },
                  }}
                />
                <Stack
                  sx={{
                    textAlign: { xs: "center", md: "start" },
                  }}
                >
                  <Typography variant="subtitle2">User name</Typography>
                  <Typography>Tho Le</Typography>
                </Stack>
              </Stack>
              <Divider orientation="vertical" variant="middle" flexItem />
              <Box>
                <Stack
                  alignItems="center"
                  sx={{
                    flexDirection: { xs: "column", md: "row" },
                  }}
                >
                  <Avatar
                    alt="Tho Le"
                    src="TL"
                    sx={{
                      width: 56,
                      height: 56,
                      mr: { xs: 0, md: 2 },
                    }}
                  />
                  <Stack
                    sx={{
                      textAlign: { xs: "center", md: "start" },
                    }}
                  >
                    <Typography variant="subtitle2">Wallet</Typography>
                    <Typography>Metamask</Typography>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Stack direction="row" alignItems="center">
                <Avatar sx={{ mr: 1 }} />
                <Link href="#" underline="hover">
                  {truncate(account, 12, -4)}
                </Link>
              </Stack>
              <Tooltip title="Copy address">
                <IconButton>
                  <ContentCopyIcon color="primary" fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
            <StyledButton customVariant="secondary">
              <OpenInNewOutlinedIcon
                color="primary"
                fontSize="small"
                sx={{ mr: 1 }}
              />
              <Typography>Etherscan</Typography>
            </StyledButton>
          </Stack>
        </Grid>
        <Grid item xs={4} md={6}>
          <List
            sx={{
              border: "1px solid ",
              borderRadius: "5px",
            }}
          >
            {accountItems.map((item, i) => (
              <Box key={item.content}>
                <ListItem disablePadding onClick={item.onClick}>
                  <ListItemButton>
                    <ListItemIcon>{item?.icon}</ListItemIcon>
                    <ListItemText primary={item?.content} />
                  </ListItemButton>
                </ListItem>
                {(i === 0 || i === accountItems.length - 2) && <Divider />}
              </Box>
            ))}
          </List>
        </Grid>
      </Grid>
    </Dialog>
  );
};

AccountMenu.propTypes = {
  account: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

AccountMenu.defaultProps = {
  account: "",
  open: false,
};

export default AccountMenu;
