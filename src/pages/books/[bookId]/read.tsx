/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { IToc, ReactReader } from "react-reader";

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Pagination,
  Stack,
  TextField,
  Typography
} from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import axios from "axios";
import { Rendition } from "epubjs";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";

import withAuth from "@/components/HOC/withAuth";
import { useNftBookMeta } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { InputController } from "@/components/shared/FormController";
import { ZenLayout } from "@/layouts/ZenLayout";
import PageIndicator from "@/pages/api/books/[bookId]/read/PageIndicator";
import { StyledButton } from "@/styles/components/Button";
import { convertHexStringToUint8Array } from "@/utils/convert";
import { Crypto } from "@/utils/crypto";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

// let LINK_EPUB =
//   "https://altmshfkgudtjr.github.io/react-epub-viewer/files/Alices%20Adventures%20in%20Wonderland.epub";
// let LINK_PDF =
//   "https://cors-anywhere.herokuapp.com/http://www.pdf995.com/samples/pdf.pdf";

async function decryptPdfFile(
  cipherText: Uint8Array,
  privateKey: any,
  iv: Uint8Array
) {
  let plainText;
  if (cipherText) {
    plainText = await Crypto.decryption(cipherText!, privateKey!, iv!);
  }
  if (plainText) {
    const blob = new Blob([plainText], { type: "application/pdf" });
    return URL.createObjectURL(blob);
  }
  // URL.revokeObjectURL(link.href);
}

const SUPPORT_FILE_TYPE = ["epub", "pdf"];
const ReadBook = () => {
  const { t } = useTranslation("readBook");

  const [tokenId, setTokenId] = useState();
  const [linkPdf, setLinkPdf] = useState<string>();
  const [linkEpub, setLinkEpub] = useState<string>();
  const { bookStoreContract } = useWeb3();
  const [page, setPage] = useState<number | string>();
  const [location, setLocation] = useState<string | number | undefined>(0);
  const [firstRenderDone, setFirstRenderDone] = useState(false);

  const [numPages, setNumPages] = useState(2);
  const [pageNumber, setPageNumber] = useState(1);
  const [inputedPage, setInputedPage] = useState(1);

  const renditionRef = useRef<Rendition | null>(null);
  const tocRef = useRef<IToc | null>(null);
  const [fileType, setFileType] = useState<string>("epub");

  const router = useRouter();
  const { bookId } = router.query;
  const { nftBookMeta } = useNftBookMeta(bookId as string);
  const [decrypting, setDecrypting] = useState(false);
  const bookFileUrl = nftBookMeta.data?.bookFile; // Url of file on pinata
  const metaDataType = nftBookMeta.data?.fileType;

  const title = nftBookMeta.data?.title + " - NFT Bookstore";

  useEffect(() => {
    (async () => {
      if (bookFileUrl) {
        setDecrypting(true);
        const dataFile = axios({
          method: "get",
          url: bookFileUrl,
          responseType: "arraybuffer",
          headers: {
            Accept: "application/pdf application/epub+zip"
          }
        })
          .then(async function (response) {
            const cipherText = new Uint8Array(response.data);
            if (tokenId) {
              const secrectKey = (await bookStoreContract!.getSecretKey(
                tokenId
              )) as unknown as string[];
              if (secrectKey.length === 2) {
                const privateKey = await Crypto.generateKey(secrectKey[1]);
                const iv = convertHexStringToUint8Array(secrectKey[0]);
                const link = (await decryptPdfFile(
                  cipherText,
                  privateKey,
                  iv
                )) as string;
                if (SUPPORT_FILE_TYPE.includes(metaDataType)) {
                  setFileType(metaDataType);
                  if (metaDataType === "pdf") {
                    setLinkPdf(link);
                  } else {
                    setLinkEpub(link);
                  }
                }
              }
            }
            setDecrypting(false);
          })
          .catch((err) => {
            if (err.code === "ERR_NETWORK") {
              window.alert("Disable your adblock and try again!");
            }
            setDecrypting(false);
          });
      }
    })();
  }, [bookFileUrl, bookStoreContract, tokenId, metaDataType]);

  useEffect(() => {
    (async () => {
      try {
        if (bookId) {
          const tokenRes = await axios.get(`/api/books/${bookId}/tokenId`);

          if (tokenRes.data.success === true) {
            setTokenId(tokenRes.data.data);
          }
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [bookId]);

  const locationChanged = (epubcifi: string) => {
    if (!firstRenderDone) {
      setLocation(localStorage.getItem("book-progress") as string); // getItem returns null if the item is not found.
      setFirstRenderDone(true);
      return;
    }
    localStorage.setItem("book-progress", epubcifi);
    setLocation(epubcifi);

    if (renditionRef.current && tocRef.current) {
      const { displayed, href } = renditionRef.current.location.start;
      const tocArray = Object.values(tocRef.current);
      const chapter = tocArray.find((item) => item.href === href);
      setPage(
        `Page ${displayed.page} of ${displayed.total} in chapter ${
          chapter ? chapter.label : "n/a"
        }`
      );
    }
  };

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

  // /*To Prevent right click on screen*/
  // useEffect(() => {
  //   document.addEventListener("contextmenu", (event) => {
  //     event.preventDefault();
  //   });
  // }, []);

  // /*To Prevent F12*/
  // useEffect(() => {
  //   document.onkeydown = (event) => {
  //     if (event.key == "F12") {
  //       // Prevent F12
  //       return false;
  //     } else if (event.ctrlKey && event.shiftKey && event.key == "i") {
  //       // Prevent Ctrl+Shift+I
  //       return false;
  //     }
  //   };
  // }, []);

  useEffect(() => {
    document.addEventListener("keydown", handlePageNavigate);
    return () => {
      document.removeEventListener("keydown", handlePageNavigate);
    };
  }, [numPages]);

  const pageBlurHandler = (event: any, pageNumber: number) => {
    setPageNumber(pageNumber);
  };

  const pageChangeHandler = (event: any, pageNumber = 1) => {
    setPageNumber(parseInt(event.target.textContent));
  };

  const handlePageNavigate = (event: KeyboardEvent) => {
    if (!event.repeat) {
      switch (event.key) {
        case "ArrowLeft":
          setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
          break;
        case "ArrowRight":
          setPageNumber((prevPageNumber) =>
            Math.min(prevPageNumber + 1, numPages)
          );
          break;
      }
    }
  };

  /*When document gets loaded successfully*/
  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="The world's first NFT Bookstore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack>
        <Button
          variant="outlined"
          size="small"
          startIcon={<KeyboardBackspaceIcon />}
          sx={{ mb: 3 }}
          onClick={() => {
            router.push("/account/bookshelf");
          }}
        >
          {t("myBookshelf")}
        </Button>

        {decrypting && (
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <CircularProgress />
            <Typography>{t("loadingMessage")}</Typography>
          </Stack>
        )}

        {!decrypting && (
          <div className="text-scanning-disabled">
            {/* Render epub file into browser view */}
            {fileType === "epub" && linkEpub && (
              <Box
                sx={{
                  width: 600,
                  height: "88vh"
                }}
              >
                <ReactReader
                  loadingView={<CircularProgress />}
                  location={location}
                  locationChanged={locationChanged}
                  url={linkEpub}
                  swipeable
                  getRendition={(rendition) =>
                    (renditionRef.current = rendition)
                  }
                  tocChanged={(toc) => (tocRef.current = toc)}
                  epubInitOptions={{
                    openAs: "epub"
                  }}
                />
                <PageIndicator page={page as string} />
              </Box>
            )}

            {/* Render pdf file into browser view */}
            {fileType === "pdf" && linkPdf && (
              <Box
                sx={{ position: "relative" }}
                onKeyPress={(event) => {
                  switch (event.key) {
                    case "ArrowLeft":
                      previousPage();
                      break;
                    case "ArrowRight":
                      alert("woe");
                      nextPage();
                      break;
                  }
                }}
              >
                <Document file={linkPdf} onLoadSuccess={onDocumentLoadSuccess}>
                  <Page pageNumber={pageNumber} renderAnnotationLayer={false} />
                </Document>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <IconButton disabled={pageNumber <= 1} onClick={previousPage}>
                    <ChevronLeftIcon />
                  </IconButton>
                  <Typography sx={{ textAlign: "center", mt: 3 }}>
                    {pageNumber || (numPages ? 1 : "--")} / {numPages || "--"}
                  </Typography>
                  <IconButton
                    disabled={pageNumber >= numPages}
                    onClick={nextPage}
                  >
                    <ChevronRightIcon />
                  </IconButton>
                </Stack>
                <Stack spacing={1}>
                  <Pagination
                    sx={{ display: "flex", justifyContent: "center" }}
                    count={numPages}
                    shape="rounded"
                    page={pageNumber}
                    onChange={(event, pageNumber) =>
                      pageChangeHandler(event, pageNumber)
                    }
                    hideNextButton
                    hidePrevButton
                  />
                  <TextField
                    type="number"
                    id="outlined-basic"
                    label={t("pageSelection")}
                    variant="outlined"
                    onBlur={(event) =>
                      pageBlurHandler(event, parseInt(event.target.value))
                    }
                    onKeyUp={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        const target = event.target as
                          | HTMLInputElement
                          | HTMLTextAreaElement;
                        target.blur();
                      }
                    }}
                    InputProps={{
                      inputProps: {
                        max: numPages,
                        min: 1
                      }
                    }}
                  />
                </Stack>
              </Box>
            )}
          </div>
        )}
      </Stack>
    </>
  );
};

ReadBook.PageLayout = ZenLayout;

export default ReadBook;

export async function getServerSideProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "readBook"
      ]))
    }
  };
}
