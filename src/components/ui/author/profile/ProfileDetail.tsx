import { useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Box,
  CircularProgress,
  FormHelperText,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import Avatar from "@mui/material/Avatar";

import { ContentCopy as ContentCopyIcon } from "@mui/icons-material";

import axios from "axios";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { useRouter } from "next/router";

import { useAccount, useOwnedNfts } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { ReadButton, ReviewButton } from "@/components/shared/BookButton";
import { ActionableBookItem } from "@/components/shared/BookItem";
import { ContentContainer } from "@/components/shared/ContentContainer";
import { ContentGroup } from "@/components/shared/ContentGroup";
import { ContentPaper } from "@/components/shared/ContentPaper";
import { FallbackNode } from "@/components/shared/FallbackNode";
import { CreatedBook, NftBook } from "@/types/nftBook";
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

const ProfileDetail = () => {
  const { t } = useTranslation("authorProfile");
  const router = useRouter();

  const { account } = useAccount();
  const { bookStoreContract } = useWeb3();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { walletAddress } = router.query;

  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const [author, setAuthor] = useState<AuthorProfileType>(() => defaultValues);
  const [books, setBooks] = useState<CreatedBook[]>([]);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

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
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const nftBooks = [] as CreatedBook[];

        const [authorData, bookData] = await Promise.all([
          await axios.get(`/api/authors/wallet/${walletAddress}`),
          await axios.get(`/api/users/wallet/${walletAddress}/created-books`)
        ]);

        const responseData = authorData.data;

        if (responseData.success == true) {
          setAuthor({
            pseudonym: responseData.data?.pseudonym,
            about: responseData.data?.about,
            email: responseData.data?.email,
            phoneNumber: responseData.data?.phoneNumber,
            website: responseData.data?.website,
            walletAddress: responseData.data?.walletAddress,
            facebook: responseData.data?.facebook,
            twitter: responseData.data?.twitter,
            linkedIn: responseData.data?.linkedIn,
            instagram: responseData.data?.instagram,
            picture: responseData.data?.picture?.secureUrl
          });
        } else {
          setError(responseData.message);
        }

        if (bookData.data.success === true) {
          const createdBooks = bookData.data.data;

          for (let i = 0; i < createdBooks.length; i++) {
            try {
              const item = createdBooks[i];
              const nftBook = await bookStoreContract!.getNftBook(item.tokenId);

              const amountTradeable =
                await bookStoreContract!.getAmountUnUsedBook(item.tokenId);

              if (item.isApproved) {
                nftBooks.push({
                  tokenId: item?.tokenId,
                  author: nftBook?.author,
                  quantity: nftBook?.quantity?.toNumber(),
                  amountTradeable: amountTradeable.toNumber(),
                  isApproved: item.isApproved
                });
              }
            } catch (err) {
              console.error(err);
            }
          }
          setBooks(nftBooks);
        }
        setIsLoading(false);
      } catch (error: any) {
        setError(error);
        setIsLoading(false);
      }
    };

    if (isMounted.current && walletAddress) {
      fetchData();
    }
  }, [bookStoreContract, walletAddress]);

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
              if (isLoading) {
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
                if (error) {
                  return (
                    <Box>
                      <FormHelperText
                        error
                        sx={{
                          marginTop: "24px",
                          fontSize: "14px"
                        }}
                      >
                        {t("errorProfileInvalid" as string)}
                      </FormHelperText>
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
                                    <Avatar
                                      src={author?.picture}
                                      sx={{
                                        width: "100%",
                                        height: "auto",
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
                                  {author?.walletAddress && (
                                    <Tooltip
                                      title={
                                        isAddressCopied
                                          ? "Copied"
                                          : "Copy address"
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
                                  )}
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
                              if (isLoading) {
                                return (
                                  <Typography>
                                    {t("loadingMessage") as string}
                                  </Typography>
                                );
                              } else if (books?.length === 0 || error) {
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
                                  {books!.map((book: NftBook) => {
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
                                          status="isCreated"
                                          tokenId={book?.tokenId}
                                          author={book?.author}
                                          onClick={handleBookClick}
                                          quantity={book?.quantity}
                                          amountTradeable={
                                            book?.amountTradeable
                                          }
                                          buttons={
                                            <Stack
                                              spacing={{ xs: 2, sm: 2, md: 3 }}
                                              sx={{ width: "100%" }}
                                            >
                                              {account.data ===
                                                walletAddress && (
                                                <>
                                                  <ReviewButton
                                                    tokenId={book?.tokenId}
                                                    author={book?.author}
                                                  />
                                                  <ReadButton
                                                    tokenId={book?.tokenId}
                                                  />
                                                </>
                                              )}
                                            </Stack>
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
              }
            })()}
          </ContentContainer>
        </Box>
        <ToastContainer />
      </main>
    </>
  );
};

export default ProfileDetail;
