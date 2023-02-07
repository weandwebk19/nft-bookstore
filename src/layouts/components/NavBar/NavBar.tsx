import { useState } from "react";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import PropTypes from "prop-types";
import images from "@/assets/images";
import { Dialog } from "@/components/shared/Dialog";
import { Drawer } from "@shared/Drawer";
import { List as CustomList } from "@shared/List";
import { StyledAppBar } from "@styles/components/AppBar";
import { StyledButton } from "@styles/components/Button";
import { ListItemProps } from "@_types/list";

interface EventTarget {
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    useCapture?: boolean
  ): void;
  dispatchEvent(evt: Event): boolean;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    useCapture?: boolean
  ): void;
}

interface SyntheticEvent {
  bubbles: boolean;
  cancelable: boolean;
  currentTarget: EventTarget;
  defaultPrevented: boolean;
  eventPhase: number;
  isTrusted: boolean;
  nativeEvent: Event;
  preventDefault(): void;
  stopPropagation(): void;
  target: EventTarget;
  timeStamp: Date;
  type: string;
}

interface NavBarProps {
  onThemeChange: (theme: string) => void;
}

const NavBar = ({ onThemeChange }: NavBarProps) => {
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

  const [anchorAccountMenu, setAnchorAccountMenu] = useState<Element | null>(
    null
  );
  const openAccountMenu = Boolean(anchorAccountMenu);

  const [anchorNavMenu, setAnchorNavMenu] = useState<Element | null>(null);
  const openNavMenu = Boolean(anchorNavMenu);

  const [anchorSettingsMenu, setAnchorSettingsMenu] = useState<Element | null>(
    null
  );
  const openSettingsMenu = Boolean(anchorSettingsMenu);

  const [openLanguage, setOpenLanguage] = useState({
    currentState: "English",
    isOpen: true,
  });

  const [openMode, setOpenMode] = useState({
    currentState: "Light",
    isOpen: true,
  });

  const handleHomeClick = () => {};

  const handleAboutClick = () => {};

  const handleContactClick = () => {};

  const handleCollectionsClick = () => {};

  const handleNavMenuItemClick = (key: string) => {
    switch (key) {
      case "About Us":
        handleAboutClick();
        break;
      case "Contact":
        handleContactClick();
        break;

      default:
        setAnchorNavMenu(null);
        break;
    }

    setAnchorNavMenu(null);
  };

  const handleAccountMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorAccountMenu(e.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAnchorAccountMenu(null);
  };

  const handleNavMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorNavMenu(e.currentTarget);
  };

  const handleNavMenuClose = () => {
    setAnchorNavMenu(null);
  };

  const handleSettingsMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorSettingsMenu(e.currentTarget);
  };

  const handleSettingsMenuClose = () => {
    setAnchorSettingsMenu(null);
  };

  const handleLanguageClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpenLanguage({
      ...openLanguage,
      currentState: e.currentTarget.innerText.slice(3),
    });
  };

  const handleModeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget);
    onThemeChange(e.currentTarget.innerText.toLowerCase());
    const currentTheme = e.currentTarget.innerText;
    setOpenMode({
      ...openMode,
      currentState: currentTheme,
    });
  };

  // const handleModeClick = (mode) => {
  //   console.log(mode);
  //   onThemeChange(mode);
  //   setOpenMode({
  //     ...openMode,
  //     currentState: capitalize(mode)
  //   });
  // }

  const settings: ListItemProps[] = [
    {
      type: "button",
      icon: <HelpOutlineOutlinedIcon color="primary" />,
      content: "Guide",
      onClick: () => {
        console.log("Guide");
      },
      disabled: true,
      subList: [],
    },
    {
      type: "divider",
      content: "",
      subList: [],
    },
    {
      type: "dropdown",
      isOpen: openSettingsMenu,
      icon: <Brightness4Icon color="primary" />,
      content: "Mode",
      subList: [
        {
          type: "button",
          icon: <LightModeOutlinedIcon color="primary" />,
          content: "Light",
          onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
            handleModeClick(e);
          },
          subList: [],
          selected: openMode,
        },
        {
          type: "button",
          icon: <DarkModeOutlinedIcon color="primary" />,
          content: "Dark",
          onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
            handleModeClick(e);
          },
          subList: [],
          selected: openMode,
        },
      ],
    },
    {
      type: "dropdown",
      icon: <LanguageIcon color="primary" />,
      content: "Language",
      subList: [
        {
          type: "button",
          icon: "EN",
          content: "English",
          onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
            handleLanguageClick(e);
          },
          selected: openLanguage,
          subList: [],
        },
        {
          type: "button",
          icon: "VI",
          content: "Tiếng Việt",
          onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
            handleLanguageClick(e);
          },
          selected: openLanguage,
          subList: [],
        },
      ],
    },
  ];

  const pages = ["About Us", "Contact"];
  const navItems: ListItemProps[] = [
    {
      type: "button",
      icon: <Avatar alt="Remy Sharp" src="" />,
      content: "0xE6e8...fAf2",
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        handleAccountMenuClick(e);
      },
      disabled: false,
      subList: [],
    },
    ...pages.map((page: string) => ({
      type: "button" as const,
      icon: "",
      content: page,
      onClick: () => handleNavMenuItemClick(page),
      disabled: false,
      subList: [],
    })),
    ...settings,
  ];

  return (
    <nav>
      <StyledAppBar className="noise">
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <Button
              onClick={handleHomeClick}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <Box
                component="img"
                src={images.logo.src}
                alt="NFT Bookstore"
                sx={{
                  width: "36px",
                }}
              />
            </Button>

            {/* Tablet */}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                color="inherit"
                onClick={handleNavMenuClick}
              >
                <MenuIcon color="primary" />
              </IconButton>
              <Drawer open={openNavMenu} onClose={handleNavMenuClose}>
                <CustomList items={navItems} />
              </Drawer>
            </Box>
            <Box
              component="img"
              src={images.horizontalLogo.src}
              alt="NFT Bookstore"
              sx={{
                height: "20px",
                display: { xs: "flex", md: "none" },
              }}
            />

            {/* PC */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => handleNavMenuItemClick(page)}
                  sx={{ mr: 2 }}
                >
                  {page}
                </Button>
              ))}
              <StyledButton
                customVariant="primary"
                onClick={() => handleCollectionsClick()}
              >
                collections
              </StyledButton>
            </Box>

            <Stack direction="row" alignItems="center" sx={{ flexGrow: 0 }}>
              <Stack
                direction="row"
                alignItems="center"
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                <Typography variant="subtitle1">0xE6e8...fAf2</Typography>
                <Tooltip title="Account menu">
                  <IconButton onClick={handleAccountMenuClick}>
                    <Avatar alt="Remy Sharp" src="" />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Dialog
                title="Account"
                open={openAccountMenu}
                onClose={handleAccountMenuClose}
              >
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
                          sx={{ flexDirection: { xs: "column", md: "row" } }}
                        >
                          <Avatar
                            alt="Tho Le"
                            src="TL"
                            sx={{ width: 56, height: 56, mr: { xs: 0, md: 2 } }}
                          />
                          <Stack
                            sx={{ textAlign: { xs: "center", md: "start" } }}
                          >
                            <Typography variant="subtitle2">
                              User name
                            </Typography>
                            <Typography>Tho Le</Typography>
                          </Stack>
                        </Stack>
                        <Divider
                          orientation="vertical"
                          variant="middle"
                          flexItem
                        />
                        <Box>
                          <Stack
                            alignItems="center"
                            sx={{ flexDirection: { xs: "column", md: "row" } }}
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
                              sx={{ textAlign: { xs: "center", md: "start" } }}
                            >
                              <Typography variant="subtitle2">
                                Wallet
                              </Typography>
                              <Typography>Metamask</Typography>
                            </Stack>
                          </Stack>
                        </Box>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Stack direction="row" alignItems="center">
                          <Avatar sx={{ mr: 1 }} />
                          <Link href="#" underline="hover">
                            0xE6e8
                            <Box
                              component="span"
                              sx={{ display: { xs: "none", md: "inline" } }}
                            >
                              dsfdsfdsxfqer6451652
                            </Box>
                            <Box
                              component="span"
                              sx={{ display: { xs: "inline", md: "none" } }}
                            >
                              ...
                            </Box>
                            8fAf2
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
                              <ListItemText>{item?.content}</ListItemText>
                            </ListItemButton>
                          </ListItem>
                          {(i === 0 || i === accountItems.length - 2) && (
                            <Divider />
                          )}
                        </Box>
                      ))}
                    </List>
                  </Grid>
                </Grid>
              </Dialog>
              <Tooltip title="Shopping bag">
                <IconButton>
                  <Badge badgeContent={3} color="secondary">
                    <ShoppingBagOutlinedIcon color="primary" />
                  </Badge>
                </IconButton>
              </Tooltip>
              {/* <Tooltip title="Toggle theme">
                <IconButton
                  onClick={onThemeChange}
                  sx={{
                    display: { xs: "none", md: "flex" }
                  }}
                >
                  {theme === "light" && (
                    <DarkModeOutlinedIcon color="primary" />
                  )}
                  {theme === "dark" && (
                    <LightModeOutlinedIcon color="primary" />
                  )}
                </IconButton>
              </Tooltip> */}
              <Tooltip title="App settings">
                <IconButton
                  onClick={handleSettingsMenuClick}
                  sx={{
                    display: { xs: "none", md: "flex" },
                  }}
                >
                  <SettingsOutlinedIcon color="primary" />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorSettingsMenu}
                id="settings-menu"
                open={openSettingsMenu}
                onClose={handleSettingsMenuClose}
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
                      mr: 1,
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
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <CustomList items={settings} />
              </Menu>
            </Stack>
          </Toolbar>
        </Container>
      </StyledAppBar>
    </nav>
  );
};

NavBar.propTypes = {
  onThemeChange: PropTypes.func,
};

NavBar.defaultProps = {
  onThemeChange: () => {},
};

export default NavBar;
