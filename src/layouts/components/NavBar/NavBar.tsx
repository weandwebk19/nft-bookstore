import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  Stack,
  Toolbar,
  Tooltip
} from "@mui/material";

import Brightness4Icon from "@mui/icons-material/Brightness4";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

// import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { ListItemProps } from "@_types/list";
import { Drawer } from "@shared/Drawer";
import { List as CustomList } from "@shared/List";
import { StyledAppBar } from "@styles/components/AppBar";
import axios from "axios";
import { motion } from "framer-motion";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { SiweMessage } from "siwe";
import {
  useConnect,
  useDisconnect,
  useNetwork,
  useSignMessage,
  useAccount as useWagmiAccount
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

import { useUserInfo } from "@/components/hooks/api/useUserInfo";
import { useLocalStorage } from "@/components/hooks/common";
import { useAccount } from "@/components/hooks/web3";
import { ActiveLink } from "@/components/shared/ActiveLink";
import { DropdownMenu } from "@/components/shared/DropdownMenu";
import { Logo } from "@/components/shared/Logo";
import { useMyTheme, useSetMyThemeContext } from "@/contexts/ThemeContext";
import { truncate } from "@/utils/truncate";

import { AccountMenu } from "../AccountMenu";
import { WalletBar } from "../WalletBar";

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

const NavBar = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { disconnect } = useDisconnect();
  // const { disconnect: switchAccount } = useAccount();

  const { data: session, status } = useSession();

  const { signMessageAsync } = useSignMessage();

  const { chain } = useNetwork();
  const { connect: wagmiConnect } = useConnect({
    connector: new InjectedConnector()
  });
  const { address: wagmiAddress, isConnected } = useWagmiAccount();
  const [address, setAddress] = useState(wagmiAddress as string);

  useEffect(() => {
    if (wagmiAddress) {
      setAddress(wagmiAddress);
    }
  }, [wagmiAddress]);

  const handleLogin = async () => {
    try {
      const callbackUrl =
        (router.query?.callbackUrl as string) ?? router.pathname ?? "/";

      const message = new SiweMessage({
        domain: window.location.host,
        address: wagmiAddress,
        statement: "Sign in with Ethereum to NFT Bookstore.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        nonce: await getCsrfToken()
      });

      const signature = await signMessageAsync({
        message: message.prepareMessage()
      });

      const result = await signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl
      });

      if (result?.error) {
        console.error(result.error);
      } else {
        router.push(callbackUrl);
      }
      //create new account
      await axios
        .post("/api/users/create", {
          wallet_address: wagmiAddress?.toLowerCase(),
          fullname: "Anonymous"
        })
        .catch((e) => {
          console.error(e);
        });
    } catch (error) {
      // window.alert(error);
      console.error(error);
    }
  };

  useEffect(() => {
    if (isConnected && !session) {
      handleLogin();
    }
  }, [isConnected, wagmiAddress]);

  const [clientTheme, setClientTheme] = useMyTheme();
  const [clientLocale, setClientLocale] = useLocalStorage("locale", "en");

  const setStoredTheme = useSetMyThemeContext();

  const { pathname, asPath, query } = router;
  const { account } = useAccount();
  const { data: userInfo } = useUserInfo();

  const [isAuthor, setIsAuthor] = useState<boolean>(
    Boolean(userInfo?.isAuthor)
  );

  useEffect(() => {
    if (userInfo?.isAuthor !== undefined) {
      setIsAuthor(userInfo?.isAuthor);
    } else {
      setIsAuthor(false);
    }
  }, [userInfo?.isAuthor]);

  // useEffect(() => {
  //   account.data && setAddress(truncate(account.data, 6, -4));
  // }, [account]);

  // useEffect(() => {
  //   wagmiAddress && setAddress(truncate(wagmiAddress, 6, -4));
  // }, [wagmiAddress]);

  const [anchorAccountMenu, setAnchorAccountMenu] = useState<Element | null>(
    null
  );
  const openAccountMenu = Boolean(anchorAccountMenu);

  const [anchorSettingsMenu, setAnchorSettingsMenu] = useState<Element | null>(
    null
  );
  const openSettingsMenu = Boolean(anchorSettingsMenu);

  const [openLanguage, setOpenLanguage] = useState({
    currentState: clientLocale,
    isOpen: true
  });

  const [openMode, setOpenMode] = useState({
    currentState: clientTheme,
    isOpen: true
  });

  const [anchorNavMenu, setAnchorNavMenu] = useState<Element | null>(null);
  const openNavMenu = Boolean(anchorNavMenu);

  const handleHomeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/");
  };

  const handleAboutClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/about");
  };

  const handleContactClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/contact");
  };

  const handleNavMenuItemClick = (key: string) => {
    switch (key) {
      case "About Us":
        (e: React.MouseEvent<HTMLButtonElement>) => handleAboutClick(e);
        break;
      case "Contact":
        (e: React.MouseEvent<HTMLButtonElement>) => handleContactClick(e);
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
    const locale = e.currentTarget.innerText.slice(0, 2).toLowerCase();
    setClientLocale(locale);
    setOpenLanguage({
      ...openLanguage,
      currentState: locale
    });

    router.push({ pathname, query }, asPath, {
      locale
    });
  };

  const handleModeClick = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    const currentTheme = e.currentTarget.dataset.value;
    setOpenMode({
      ...openMode,
      currentState: currentTheme
    });
    setStoredTheme(currentTheme!.toLowerCase());
  };

  const handlePublishABookClick = () => {
    router.push("/books/create");
  };

  const handleCreateListingClick = () => {
    router.push("/account/bookshelf/owned-books");
  };

  const handleCreateRentalClick = () => {
    router.push("/rental/create");
  };

  const handlePublishingClick = () => {
    router.push("/publishing");
  };

  const handleShareClick = () => {
    router.push("/share");
  };

  const handleBorrowClick = () => {
    router.push("/borrow");
  };

  const settings: ListItemProps[] = [
    {
      type: "button",
      icon: <HelpOutlineOutlinedIcon color="primary" />,
      content: t("navbar:guide") as string,
      onClick: () => {
        console.log("Guide");
      },
      disabled: true,
      subList: []
    },
    {
      type: "divider",
      content: "",
      subList: []
    },
    {
      type: "dropdown",
      isOpen: openSettingsMenu,
      icon: <Brightness4Icon color="primary" />,
      content: t("navbar:mode") as string,
      subList: [
        {
          type: "button",
          icon: <LightModeOutlinedIcon color="primary" />,
          content: t("navbar:light") as string,
          value: "light",
          onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
            handleModeClick(e);
          },
          subList: [],
          selected: openMode
        },
        {
          type: "button",
          icon: <DarkModeOutlinedIcon color="primary" />,
          content: t("navbar:dark") as string,
          value: "dark",
          onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
            handleModeClick(e);
          },
          subList: [],
          selected: openMode
        }
      ]
    },
    {
      type: "dropdown",
      icon: <LanguageIcon color="primary" />,
      content: t("navbar:language") as string,
      subList: [
        {
          type: "button",
          icon: "EN",
          content: "English",
          value: "en",
          onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
            handleLanguageClick(e);
          },
          selected: openLanguage,
          subList: []
        },
        {
          type: "button",
          icon: "VI",
          content: "Tiếng Việt",
          value: "vi",
          onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
            handleLanguageClick(e);
          },
          selected: openLanguage,
          subList: []
        }
      ]
    }
  ];

  const pages = [
    { name: t("navbar:about"), href: "/about", current: false },
    { name: t("navbar:contact"), href: "/contact", current: false }
  ];

  const bookStoreList: ListItemProps[] = [
    {
      type: "link",
      href: "/publishing",
      icon: null,
      content: t("navbar:publishing") as string,
      onClick: () => handlePublishingClick(),
      disabled: false,
      subList: []
    },
    {
      type: "link",
      href: "/borrow",
      icon: null,
      content: t("navbar:borrow") as string,
      onClick: () => handleBorrowClick(),
      disabled: false,
      subList: []
    },
    {
      type: "link",
      href: "/share",
      icon: null,
      content: t("navbar:share") as string,
      onClick: () => handleShareClick(),
      disabled: false,
      subList: []
    }
  ];

  const navItems: ListItemProps[] = [
    session
      ? {
          type: "button",
          icon: <Avatar alt="Remy Sharp" src="" />,
          content: address,
          onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
            handleAccountMenuClick(e);
          },
          disabled: false,
          subList: []
        }
      : {
          type: "divider",
          subList: []
        },
    // account.data
    //   ? {
    //       type: "button",
    //       icon: <ShoppingBagOutlinedIcon color="primary" />,
    //       content: t("navbar:shoppingBag") as string,
    //       onClick: (e: React.MouseEvent<HTMLButtonElement>) => {},
    //       disabled: false,
    //       subList: []
    //     }
    //   : {
    //       type: "divider",
    //       subList: []
    //     },
    {
      type: "divider",
      content: "",
      subList: []
    },
    ...pages.map((page: any) => ({
      type: "link" as const,
      href: page.href,
      icon: "",
      content: page.name,
      onClick: () => handleNavMenuItemClick(page.name),
      disabled: false,
      subList: []
    })),
    {
      type: "divider",
      content: "",
      subList: []
    },
    ...bookStoreList,
    {
      type: "divider",
      content: "",
      subList: []
    },
    ...settings
  ];

  const createList: ListItemProps[] = [
    userInfo?.isAuthor !== undefined
      ? {
          type: "button",
          icon: null,
          content: t("navbar:newBook") as string,
          onClick: () => handlePublishABookClick(),
          disabled: false,
          subList: [],
          href: "/books/create"
        }
      : {
          type: "divider",
          subList: []
        },
    {
      type: "button",
      icon: null,
      content: t("navbar:createListing") as string,
      onClick: () => handleCreateListingClick(),
      disabled: false,
      subList: [],
      href: "/account/owned-books"
    },
    {
      type: "button",
      icon: null,
      content: t("navbar:createRental") as string,
      onClick: () => handleCreateRentalClick(),
      disabled: false,
      subList: [],
      href: "/account/create-rental"
    }
  ];

  return (
    <motion.div
      initial={{
        y: 25,
        opacity: 0
      }}
      animate={{
        y: 0,
        opacity: 1
      }}
      transition={{ duration: 0.75 }}
    >
      <Box component="nav">
        <StyledAppBar>
          <Container maxWidth="lg">
            <Toolbar
              disableGutters
              sx={{
                justifyContent: "space-between"
              }}
            >
              <Button
                onClick={handleHomeClick}
                sx={{
                  display: {
                    xs: "none",
                    md: "block"
                  }
                }}
              >
                {/* <Box
                component="img"
                src={images.logo}
                alt="NFT Bookstore"
                sx={{
                  width: "36px"
                }}
              /> */}
                <Logo />
              </Button>

              {/* Tablet */}
              <Box
                sx={{
                  display: {
                    xs: "flex",
                    md: "none"
                  }
                }}
              >
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

              {/* PC */}
              <Box
                sx={{
                  flexGrow: 1,
                  display: {
                    xs: "none",
                    sm: "none",
                    md: "flex"
                  }
                }}
              >
                {pages.map((page) => (
                  <ActiveLink key={page.name} href={page.href}>
                    <Button
                      onClick={() => handleNavMenuItemClick(page.name)}
                      sx={{
                        mr: 2
                      }}
                    >
                      {page.name}
                    </Button>
                  </ActiveLink>
                ))}
                <Box sx={{ mr: 2 }}>
                  <DropdownMenu
                    buttonVariant="contained"
                    tooltipTitle={t("navbar:toolTip_bookstore") as string}
                    buttonName={t("navbar:bookstore")}
                    items={bookStoreList}
                  />
                </Box>

                {session && wagmiAddress && (
                  <Box sx={{ mr: 2 }}>
                    <DropdownMenu
                      buttonVariant="outlined"
                      tooltipTitle={t("navbar:toolTip_create") as string}
                      buttonName={t("navbar:create")}
                      items={createList}
                    />
                  </Box>
                )}
              </Box>

              <Stack direction="row" alignItems="center" sx={{ flexGrow: 0 }}>
                <WalletBar
                  isInstalled={account.isInstalled}
                  isLoading={account.isLoading}
                  connect={wagmiConnect}
                  // account={account.data}
                  account={wagmiAddress}
                  switchAccount={account.switchAccount}
                  disconnect={disconnect}
                  handleLogin={handleLogin}
                  isConnected={isConnected}
                  isAuthor={isAuthor}
                />
                <AccountMenu
                  account={wagmiAddress}
                  open={openAccountMenu}
                  onClose={handleAccountMenuClose}
                  switchAccount={account.switchAccount}
                  disconnect={disconnect}
                  isAuthor={isAuthor}
                />
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

                <Tooltip title={t("navbar:toolTip_appSettings")}>
                  <IconButton
                    onClick={handleSettingsMenuClick}
                    sx={{
                      display: {
                        xs: "none",
                        md: "flex"
                      }
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
                  disableScrollLock={true}
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
                  <CustomList items={settings} />
                </Menu>
              </Stack>
            </Toolbar>
          </Container>
        </StyledAppBar>
      </Box>
    </motion.div>
  );
};

export async function getServerSideProps(context: any) {
  return {
    props: {
      csrfToken: await getCsrfToken(context)
    }
  };
}

export default NavBar;
