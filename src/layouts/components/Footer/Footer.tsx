import React from "react";

import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography
} from "@mui/material";

import { styled } from "@mui/system";
import styles from "@styles/Footer.module.scss";
import Link from "next/link";

import images from "@/assets/images";
import { Logo } from "@/components/shared/Logo";

const StyledTypography = styled(Typography)(({}) => ({
  "&:hover": {
    opacity: 0.7
  }
}));

const Footer = () => {
  const footerItems = [
    {
      content: "Our store",
      subList: [
        {
          content: "Explore",
          url: "/"
        },
        {
          content: "Trade-in",
          url: "/"
        },
        {
          content: "Borrow",
          url: "/borrow"
        },
        {
          content: "Publish a book",
          url: "/"
        }
      ]
    },
    {
      content: "My account",
      subList: [
        {
          content: "Profile",
          url: "/profile"
        },
        {
          content: "Watchlist",
          url: "/watchlist"
        },
        {
          content: "Favorites",
          url: "/favorites"
        },
        {
          content: "My bookshelf",
          url: "/"
        }
      ]
    },
    {
      content: "Blog",
      subList: []
    },
    {
      content: "Contact us",
      subList: []
    },
    {
      content: "Stats",
      subList: [
        {
          content: "Author ranking",
          url: "/"
        },
        {
          content: "User ranking",
          url: "/"
        },
        {
          content: "Book ranking",
          url: "/"
        }
      ]
    }
  ];

  return (
    <Box className={styles.footer}>
      <Grid
        container
        spacing={{ xs: 2, md: 3, lg: 4 }}
        columns={{ xs: 4, md: 24 }}
        sx={{
          marginTop: "24px",
          padding: "64px 32px 32px"
        }}
        className={styles.footer__wrapper}
      >
        <Grid item xs={4} md={8} className="footer__intro">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "24px"
            }}
          >
            <Link href="/">
              <Logo fill="#e1ddc4" size={64} />
            </Link>
            <Typography variant="h5" className={styles.footer__description}>
              NFT Bookstore
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: "16px",
                lineHeight: "20px",
                fontWeight: 400,
                userSelect: "text"
              }}
            >
              The first and biggest digital bookstore for NFT books in the
              world. Purchase, sell, and find unique digital books.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4} md={16} className="footer__category">
          <Grid
            container
            spacing={{ xs: 2, md: 3, lg: 4 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            className={styles.footer__list}
          >
            {footerItems.length > 0 &&
              footerItems.map((item) => (
                <Grid
                  item
                  xs={4}
                  sm={4}
                  md={2}
                  key={item.content}
                  className="footer__item"
                >
                  <Typography variant="h5" gutterBottom>
                    {item.content}
                  </Typography>
                  <Box>
                    <List>
                      {item?.subList?.length > 0 &&
                        item.subList.map((itemInSubList) => (
                          <Link
                            key={itemInSubList.content}
                            href={itemInSubList.url}
                            style={{
                              color: "#F8EFE7"
                            }}
                          >
                            <ListItem
                              sx={{
                                cursor: "pointer",
                                p: 0,
                                "&:hover": {
                                  opacity: 0.7
                                }
                              }}
                            >
                              <ListItemText primary={itemInSubList.content} />
                            </ListItem>
                          </Link>
                        ))}
                    </List>
                  </Box>
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        xs={24}
        sx={{
          paddingTop: "32px",
          paddingBottom: "32px",
          borderTop: "1px solid #34302A"
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "32px"
          }}
        >
          <Link
            href="/policy"
            style={{
              color: "#F8EFE7"
            }}
          >
            <StyledTypography
              variant="body1"
              sx={{
                fontSize: "16px",
                lineHeight: "20px",
                fontWeight: 400
              }}
            >
              Privacy Policy
            </StyledTypography>
          </Link>
          <Link
            href="/service"
            style={{
              color: "#F8EFE7"
            }}
          >
            <StyledTypography
              variant="body1"
              sx={{
                fontSize: "16px",
                lineHeight: "20px",
                fontWeight: 400
              }}
            >
              Term of Service
            </StyledTypography>
          </Link>
        </Box>
      </Grid>
    </Box>
  );
};

export default Footer;
