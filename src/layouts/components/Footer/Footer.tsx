import { Box, Button, Grid, List, ListItem, ListItemText, Typography } from '@mui/material';
import PropTypes from "prop-types";
import images from "@/assets/images";
import { styled } from "@mui/system";
import React from 'react';

const BoxWrapper = styled(Box)(({ theme }) => ({
    // backgroundColor: theme.palette.background.paper,
    backgroundColor: "#1F1B16",
}));

interface FooterProps {
    onThemeChange: (theme: string) => void;
}

const Footer = ({ onThemeChange }: FooterProps) => {
    return (
        <Box className="footer"
            sx={{
                backgroundColor: "#1F1B16",
                color: "#F8EFE7",
                padding: "16px"
            }}
        >
            <Grid
                container
                spacing={{ xs: 2, md: 3, lg: 4 }}
                // columns={{ xs: 4, sm: 8, md: 12, lg: 24, xl: 24 }}
                columns={{ xs: 24 }}
                sx={{
                    marginTop: "24px"
                }}
                className="grid"
            >
                <Grid
                    item
                    // xs={4}
                    // sm={8}
                    // md={6}
                    // lg={8}
                    // xl={6}
                    xs={8}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "24px"
                        }}
                    >
                        <Box
                            component="img"
                            src={images.logo.src}
                            alt="NFT Bookstore"
                            sx={{
                                width: "60px",
                                marginBottom: "24px"
                            }}
                        />
                        <Typography
                            variant="h5"
                            sx={{
                                fontSize: "24px",
                                lineHeight: "30px",
                                fontWeight: 400,
                                marginBottom: "24px",
                            }}
                        >
                            NFT Bookstore
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                fontSize: "16px",
                                lineHeight: "20px",
                                fontWeight: 400,
                            }}>
                            The first and biggest digital bookstore for NFT books in the world. Purchase, sell, and find unique digital books.
                        </Typography>
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={16}
                >
                    <Box>
                        <Grid
                            container
                            spacing={{ xs: 2, md: 3, lg: 4 }}
                            columns={{ xs: 10 }}
                            className="grid__2"
                        >
                            <Grid
                                item
                                xs={2}
                            >
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontSize: "24px",
                                        lineHeight: "30px",
                                        fontWeight: 400,
                                        marginBottom: "16px",
                                    }}
                                >
                                    Our store
                                </Typography>
                                <BoxWrapper>
                                    <List>
                                        <ListItem
                                            sx={{
                                                cursor: "pointer",
                                                padding: "8px 0px"
                                            }}
                                        >
                                            <ListItemText
                                                primary="Explore"
                                            />
                                        </ListItem>
                                        <ListItem
                                            sx={{
                                                cursor: "pointer",
                                                padding: "8px 0px"
                                            }}
                                        >
                                            <ListItemText
                                                primary="Trade-in"
                                            />
                                        </ListItem>
                                        <ListItem
                                            sx={{
                                                cursor: "pointer",
                                                padding: "8px 0px"
                                            }}
                                        >
                                            <ListItemText
                                                primary="Borrow"
                                            />
                                        </ListItem>
                                        <ListItem
                                            sx={{
                                                cursor: "pointer",
                                                padding: "8px 0px"
                                            }}
                                        >
                                            <ListItemText
                                                primary="Publish a book"
                                            />
                                        </ListItem>
                                    </List>
                                </BoxWrapper>
                            </Grid>
                            <Grid
                                item
                                xs={2}
                            >
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontSize: "24px",
                                        lineHeight: "30px",
                                        fontWeight: 400,
                                        marginBottom: "16px",
                                    }}
                                >
                                    My account
                                </Typography>
                                <BoxWrapper>
                                    <List>
                                        <ListItem
                                            sx={{
                                                cursor: "pointer",
                                                padding: "4px 0px"
                                            }}
                                        >
                                            <ListItemText
                                                primary="Profile"
                                            />
                                        </ListItem>
                                        <ListItem
                                            sx={{
                                                cursor: "pointer",
                                                padding: "4px 0px"
                                            }}
                                        >
                                            <ListItemText
                                                primary="Watchlist"
                                            />
                                        </ListItem>
                                        <ListItem
                                            sx={{
                                                cursor: "pointer",
                                                padding: "4px 0px"
                                            }}
                                        >
                                            <ListItemText
                                                primary="Favorites"
                                            />
                                        </ListItem>
                                        <ListItem
                                            sx={{
                                                cursor: "pointer",
                                                padding: "4px 0px"
                                            }}
                                        >
                                            <ListItemText
                                                primary="My bookshelf"
                                            />
                                        </ListItem>
                                    </List>
                                </BoxWrapper>
                            </Grid>
                            <Grid
                                item
                                xs={2}
                            >
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontSize: "24px",
                                        lineHeight: "30px",
                                        fontWeight: 400,
                                        marginBottom: "16px",
                                    }}
                                >
                                    Blog
                                </Typography>
                                <BoxWrapper>
                                </BoxWrapper>
                            </Grid>
                            <Grid
                                item
                                xs={2}
                            >
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontSize: "24px",
                                        lineHeight: "30px",
                                        fontWeight: 400,
                                        marginBottom: "16px",
                                    }}
                                >
                                    Contact us
                                </Typography>
                                <BoxWrapper>
                                    <List>
                                        <ListItem
                                            sx={{
                                                cursor: "pointer",
                                                padding: "4px 0px"
                                            }}
                                        >
                                            <ListItemText
                                                primary="Explore"
                                            />
                                        </ListItem>
                                        <ListItem
                                            sx={{
                                                cursor: "pointer",
                                                padding: "4px 0px"
                                            }}
                                        >
                                            <ListItemText
                                                primary="Trade-in"
                                            />
                                        </ListItem>
                                        <ListItem
                                            sx={{
                                                cursor: "pointer",
                                                padding: "4px 0px"
                                            }}
                                        >
                                            <ListItemText
                                                primary="Borrow"
                                            />
                                        </ListItem>
                                        <ListItem
                                            sx={{
                                                cursor: "pointer",
                                                padding: "4px 0px"
                                            }}
                                        >
                                            <ListItemText
                                                primary="Publish a book"
                                            />
                                        </ListItem>
                                    </List>
                                </BoxWrapper>
                            </Grid>
                            <Grid
                                item
                                xs={2}
                            >
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontSize: "24px",
                                        lineHeight: "30px",
                                        fontWeight: 400,
                                        marginBottom: "16px",
                                    }}
                                >
                                    Stats
                                </Typography>
                                <BoxWrapper>
                                    <List>
                                        <ListItem
                                            sx={{
                                                cursor: "pointer",
                                                padding: "4px 0px"
                                            }}
                                        >
                                            <ListItemText
                                                primary="Author ranking"
                                            />
                                        </ListItem>
                                        <ListItem
                                            sx={{
                                                cursor: "pointer",
                                                padding: "8px 0px"
                                            }}
                                        >
                                            <ListItemText
                                                primary="User ranking"
                                            />
                                        </ListItem>
                                        <ListItem
                                            sx={{
                                                cursor: "pointer",
                                                padding: "8px 0px"
                                            }}
                                        >
                                            <ListItemText
                                                primary="Book ranking"
                                            />
                                        </ListItem>
                                    </List>
                                </BoxWrapper>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

Footer.propTypes = {
    onThemeChange: PropTypes.func,
};

Footer.defaultProps = {
    onThemeChange: () => { },
};

export default Footer;
