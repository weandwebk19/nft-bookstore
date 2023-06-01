import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
  Typography
} from "@mui/material";
import Avatar from "@mui/material/Avatar";

import { ContentCopy as ContentCopyIcon } from "@mui/icons-material";

import axios from "axios";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";

import withAuth from "@/components/HOC/withAuth";
import { useAuthorInfo } from "@/components/hooks/api/useAuthorInfo";
import { useOwnedNfts } from "@/components/hooks/web3";
import { ReadButton, ReviewButton } from "@/components/shared/BookButton";
import { ActionableBookItem } from "@/components/shared/BookItem";
import { ContentContainer } from "@/components/shared/ContentContainer";
import { ContentGroup } from "@/components/shared/ContentGroup";
import { ContentPaper } from "@/components/shared/ContentPaper";
import { FallbackNode } from "@/components/shared/FallbackNode";
import { FilterField } from "@/types/filter";
import { NftBook } from "@/types/nftBook";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";
import { truncate } from "@/utils/truncate";

const defaultValues = {
  pseudonym: "",
  about: "",
  email: "",
  phoneNumber: "",
  website: "",
  walletAddress: "",
  facebook: "",
  twitter: "",
  linkedIn: "",
  instagram: "",
  picture: ""
};

type AuthorProfileType = {
  pseudonym: string;
  about: string;
  email: string;
  phoneNumber: string;
  website: string;
  walletAddress: string;
  facebook: string;
  twitter: string;
  linkedIn: string;
  instagram: string;
  picture: string;
};

const Profile = () => {
  const { t } = useTranslation("authorProfile");
  const router = useRouter();

  const authorInfo = useAuthorInfo();
  const { nfts } = useOwnedNfts({} as FilterField);
  const ownedBooks = nfts.data;

  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const [author, setAuthor] = useState<AuthorProfileType>(() => defaultValues);

  const handleBookClick = (tokenId: number | string) => {
    (async () => {
      const res = await axios.get(`/api/books/token/${tokenId}/bookId`);

      if (res.data.success === true) {
        const bookId = res.data.data;
        router.push(`/books/${bookId}`);
      }
    })();
  };

  useEffect(() => {
    setAuthor({
      pseudonym: authorInfo.data?.pseudonym,
      about: authorInfo.data?.about,
      email: authorInfo.data?.email,
      phoneNumber: authorInfo.data?.phoneNumber,
      website: authorInfo.data?.website,
      walletAddress: authorInfo.data?.walletAddress,
      facebook: authorInfo.data?.facebook,
      twitter: authorInfo.data?.twitter,
      linkedIn: authorInfo.data?.linkedIn,
      instagram: authorInfo.data?.instagram,
      picture: authorInfo.data?.picture?.secureUrl
    });
  }, [authorInfo.data]);

  return (
    <>
      <Head>
        <title>{t("titlePage") as string}</title>
        <meta name="description" content="The world's first NFT Bookstore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Box sx={{ pt: 6 }}>
          <ContentContainer titles={[t("titleContent1") as string]}>
            {(() => {
              if (authorInfo.isLoading) {
                return (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "200px"
                    }}
                  >
                    <CircularProgress />
                  </Box>
                );
              } else {
                return (
                  <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <ContentGroup title="">
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Box
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center"
                                }}
                              >
                                {author?.picture ? (
                                  <Box
                                    component="img"
                                    src={author?.picture}
                                    sx={{
                                      width: "100%",
                                      maxWidth: "400px",
                                      aspectRatio: "1 / 1",
                                      borderRadius: "100rem",
                                      objectFit: "cover",
                                      margin: "auto"
                                    }}
                                  />
                                ) : (
                                  <Avatar
                                    alt="picture"
                                    src=""
                                    sx={{
                                      display: "flex",
                                      maxWidth: "400px",
                                      width: "100%",
                                      height: "100%",
                                      aspectRatio: "1 / 1",
                                      borderRadius: "100rem",
                                      margin: "auto"
                                    }}
                                  />
                                )}
                              </Box>
                            </Grid>
                          </Grid>
                        </ContentGroup>
                      </Grid>
                      <Grid item xs={12}>
                        <ContentPaper title={t("titleInfo") as string}>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Typography variant="label" gutterBottom>
                                {t("pseudonym") as string}
                                {": "}
                                <Typography variant="body1" component="span">
                                  {author.pseudonym
                                    ? author.pseudonym
                                    : (t("noInformationYet") as string)}
                                </Typography>
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="label" gutterBottom>
                                {t("about") as string}
                                {": "}
                                <Typography variant="body1" component="span">
                                  {author.about
                                    ? author.about
                                    : (t("noInformationYet") as string)}
                                </Typography>
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="label" gutterBottom>
                                {t("email") as string}
                                {": "}
                                <Typography variant="body1" component="span">
                                  {author.email
                                    ? author.email
                                    : (t("noInformationYet") as string)}
                                </Typography>
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="label" gutterBottom>
                                {t("phoneNumber") as string}
                                {": "}
                                <Typography variant="body1" component="span">
                                  {author.phoneNumber
                                    ? author.phoneNumber
                                    : (t("noInformationYet") as string)}
                                </Typography>
                              </Typography>
                            </Grid>
                          </Grid>
                        </ContentPaper>
                      </Grid>
                      <Grid item xs={12}>
                        <ContentPaper title={t("titleSocial") as string}>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Typography variant="label" gutterBottom>
                                {t("website") as string}
                                {": "}
                                <Typography variant="body1" component="span">
                                  {author.website
                                    ? author.website
                                    : (t("noInformationYet") as string)}
                                </Typography>
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="label" gutterBottom>
                                {t("walletAddress") as string}
                                {": "}
                                <Typography variant="body1" component="span">
                                  {author?.walletAddress
                                    ? truncate(author.walletAddress, 12, -4)
                                    : ""}
                                </Typography>
                                <Tooltip
                                  title={
                                    isAddressCopied ? "Copied" : "Copy address"
                                  }
                                  style={{
                                    marginLeft: "24px",
                                    padding: 0
                                  }}
                                >
                                  <IconButton
                                    edge="end"
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        author?.walletAddress
                                      );
                                      setIsAddressCopied(true);
                                    }}
                                  >
                                    <ContentCopyIcon />
                                  </IconButton>
                                </Tooltip>
                              </Typography>
                            </Grid>
                          </Grid>
                        </ContentPaper>
                      </Grid>
                      <Grid item xs={12}>
                        <ContentPaper title={t("socialMedia") as string}>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Typography variant="label" gutterBottom>
                                Facebook
                                {": "}
                                <Typography variant="body1" component="span">
                                  {author.facebook ? author.facebook : ""}
                                </Typography>
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="label" gutterBottom>
                                Twitter
                                {": "}
                                <Typography variant="body1" component="span">
                                  {author.twitter
                                    ? author.twitter
                                    : (t("noInformationYet") as string)}
                                </Typography>
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="label" gutterBottom>
                                LinkedIn
                                {": "}
                                <Typography variant="body1" component="span">
                                  {author.linkedIn
                                    ? author.linkedIn
                                    : (t("noInformationYet") as string)}
                                </Typography>
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="label" gutterBottom>
                                Instagram
                                {": "}
                                <Typography variant="body1" component="span">
                                  {author.instagram
                                    ? author.instagram
                                    : (t("noInformationYet") as string)}
                                </Typography>
                              </Typography>
                            </Grid>
                          </Grid>
                        </ContentPaper>
                      </Grid>
                      <Grid item xs={12}>
                        <ContentPaper title={t("authorBook") as string}>
                          {(() => {
                            if (nfts.isLoading) {
                              return (
                                <Typography>
                                  {t("loadingMessage") as string}
                                </Typography>
                              );
                            } else if (ownedBooks?.length === 0 || nfts.error) {
                              return (
                                <FallbackNode>
                                  <Typography>
                                    {t("emptyMessage") as string}
                                  </Typography>
                                </FallbackNode>
                              );
                            }
                            return (
                              <Grid
                                container
                                spacing={3}
                                columns={{ xs: 4, sm: 8, md: 12, lg: 24 }}
                              >
                                {ownedBooks!.map((book: NftBook) => {
                                  return (
                                    <Grid
                                      item
                                      key={book.tokenId}
                                      xs={4}
                                      sm={4}
                                      md={6}
                                      lg={8}
                                    >
                                      <ActionableBookItem
                                        status="isOwned"
                                        tokenId={book?.tokenId}
                                        owner={book?.author}
                                        onClick={handleBookClick}
                                        quantity={book?.quantity}
                                        amountOwned={book?.amountOwned}
                                        amountTradeable={book?.amountTradeable}
                                        buttons={
                                          <>
                                            <ReviewButton
                                              tokenId={book?.tokenId}
                                              author={book?.author}
                                            />
                                            <ReadButton
                                              tokenId={book?.tokenId}
                                            />
                                          </>
                                        }
                                      />
                                    </Grid>
                                  );
                                })}
                              </Grid>
                            );
                          })()}
                        </ContentPaper>
                      </Grid>
                    </Grid>
                  </Box>
                );
              }
            })()}
          </ContentContainer>
        </Box>
        <ToastContainer />
      </main>
    </>
  );
};

export default withAuth(Profile);

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "authorProfile",
        "bookButtons"
      ]))
    }
  };
}
