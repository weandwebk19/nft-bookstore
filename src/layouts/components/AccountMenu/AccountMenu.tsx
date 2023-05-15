import {
  Avatar,
  Box,
  Chip,
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
  Typography
} from "@mui/material";

import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import SwitchAccountOutlinedIcon from "@mui/icons-material/SwitchAccountOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { Dialog } from "@shared/Dialog";
import { StyledButton } from "@styles/components/Button";
import { signOut } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

import images from "@/assets/images";
import { useUserInfo } from "@/components/hooks/api/useUserInfo";
import { StyledChip } from "@/styles/components/Chip";
import { truncate } from "@/utils/truncate";

interface AccountMenuProps {
  account?: string;
  userName?: string;
  avatar?: string;
  open: boolean;
  onClose(...args: unknown[]): unknown;
  switchAccount(...args: unknown[]): unknown;
  disconnect(...args: unknown[]): unknown;
  isAuthor: boolean;
}

const AccountMenu = ({
  account,
  userName,
  avatar,
  open,
  onClose,
  switchAccount,
  disconnect,
  isAuthor
}: AccountMenuProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  const accountItems = [
    {
      icon: <PermIdentityOutlinedIcon color="primary" fontSize="small" />,
      content: t("navbar:my_profile") as string,
      onClick: () => {
        router.push("/account/profile");
      }
    },
    // {
    //   icon: <PermIdentityOutlinedIcon color="primary" fontSize="small" />,
    //   content: t("My Profile 2") as string,
    //   onClick: () => {
    //     router.push("/account/profile2");
    //   }
    // },
    // {
    //   icon: <BookmarkBorderOutlinedIcon color="primary" fontSize="small" />,
    //   content: t("navbar:favorites") as string,
    //   onClick: () => {
    //     router.push("/account/favorites");
    //   }
    // },
    {
      icon: <VisibilityOutlinedIcon color="primary" fontSize="small" />,
      content: t("navbar:watchlist") as string,
      onClick: () => {
        router.push("/account/watchlist");
      }
    },
    {
      icon: (
        <CollectionsBookmarkOutlinedIcon color="primary" fontSize="small" />
      ),
      content: t("navbar:my_bookshelf") as string,
      onClick: () => {
        router.push("/account/bookshelf");
      }
    },
    {
      icon: <MailOutlineIcon color="primary" fontSize="small" />,
      content: t("navbar:mailBox") as string,
      onClick: () => {
        router.push("/account/mailbox");
      }
    },
    {
      icon: <PaidOutlinedIcon color="primary" fontSize="small" />,
      content: t("navbar:transactionHistory") as string,
      onClick: () => {
        router.push("/account/transaction-history");
      }
    },
    {
      icon: <SwitchAccountOutlinedIcon color="primary" fontSize="small" />,
      content: t("navbar:switchAccount") as string,
      onClick: () => {
        switchAccount();
      }
    },
    {
      icon: <LogoutOutlinedIcon color="primary" fontSize="small" />,
      content: t("navbar:disconnect") as string,
      onClick: () => {
        disconnect();
        signOut({ redirect: false });
      }
    }
  ];

  return (
    <Dialog
      title={t("navbar:title_account") as string}
      open={open}
      onClose={onClose}
    >
      <Stack direction="row" sx={{ mb: 3 }} spacing={3}>
        {isAuthor ? (
          <StyledChip
            label={t("navbar:authorAccount")}
            background={images.gradient1}
          />
        ) : (
          <Stack direction="row" spacing={3}>
            <Chip label={t("navbar:readerAccount")} />
            <StyledButton
              size="small"
              onClick={() => {
                router.push("/author/request");
              }}
            >
              {t("navbar:becomeAnAuthor")}
            </StyledButton>
          </Stack>
        )}
      </Stack>
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
                padding: 3
              }}
            >
              <Stack
                alignItems="center"
                sx={{
                  flexDirection: { xs: "column", md: "row" }
                }}
              >
                <Avatar
                  alt="{userName}"
                  src=""
                  sx={{
                    width: 56,
                    height: 56,
                    mr: { xs: 0, md: 2 }
                  }}
                />
                <Stack
                  sx={{
                    textAlign: { xs: "center", md: "start" }
                  }}
                >
                  <Typography variant="subtitle2">User name</Typography>
                  <Typography>{userName}</Typography>
                </Stack>
              </Stack>
              <Divider orientation="vertical" variant="middle" flexItem />
              <Box>
                <Stack
                  alignItems="center"
                  sx={{
                    flexDirection: { xs: "column", md: "row" }
                  }}
                >
                  <Avatar
                    alt={userName}
                    src={avatar}
                    sx={{
                      width: 56,
                      height: 56,
                      mr: { xs: 0, md: 2 }
                    }}
                  />
                  <Stack
                    sx={{
                      textAlign: { xs: "center", md: "start" }
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
              borderRadius: "5px"
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
  onClose: PropTypes.func.isRequired
};

AccountMenu.defaultProps = {
  account: "",
  open: false
};

export default AccountMenu;
