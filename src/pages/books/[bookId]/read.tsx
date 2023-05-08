import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { IToc, ReactReader } from "react-reader";

import { Box, Button, IconButton, Stack, Typography } from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import { Rendition } from "epubjs";
import { useRouter } from "next/router";

import { useBookDetail } from "@/components/hooks/web3";
import { ZenLayout } from "@/layouts/ZenLayout";
import PageIndicator from "@/pages/api/books/[bookId]/read/PageIndicator";
import { StyledButton } from "@/styles/components/Button";

const LINK_EPUB =
  "https://altmshfkgudtjr.github.io/react-epub-viewer/files/Alices%20Adventures%20in%20Wonderland.epub";
const LINK_PDF =
  "https://cors-anywhere.herokuapp.com/http://www.pdf995.com/samples/pdf.pdf";

const ReadBook = () => {
  const [page, setPage] = useState("");
  const [location, setLocation] = useState<string | number | undefined>(0);
  const [firstRenderDone, setFirstRenderDone] = useState(false);

  const [numPages, setNumPages] = useState(2);
  const [pageNumber, setPageNumber] = useState(1);

  const renditionRef = useRef<Rendition | null>(null);
  const tocRef = useRef<IToc | null>(null);

  const fileType = "epub";

  const router = useRouter();
  const { bookId } = router.query;
  const { bookDetail } = useBookDetail(bookId as string);
  const bookFileUrl = bookDetail.data?.meta.bookFile; // Url of file on pinata
  console.log(bookFileUrl);

  const locationChanged = (epubcifi: string) => {
    if (!firstRenderDone) {
      setLocation(localStorage.getItem("book-progress") as string); // getItem returns null if the item is not found.
      setFirstRenderDone(true);
      return;
    }
    localStorage.setItem("book-progress", epubcifi);
    setLocation(epubcifi);

    if (renditionRef.current && tocRef.current) {
      console.log(renditionRef);
      const { displayed, href } = renditionRef.current.location.start;
      const chapter = tocRef.current.find((item) => item.href === href);
      setPage(
        `Page ${displayed.page} of ${displayed.total} in chapter ${
          chapter ? chapter.label : "n/a"
        }`
      );
    }
  };

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

  /*To Prevent right click on screen*/
  // useEffect(() => {
  // document.addEventListener("contextmenu", (event) => {
  //   event.preventDefault();
  // });
  // }, []);

  useEffect(() => {
    document.addEventListener("keydown", handlePageNavigate);
    return () => {
      document.removeEventListener("keydown", handlePageNavigate);
    };
  }, [numPages]);

  const handlePageNavigate = (event: KeyboardEvent) => {
    console.log("pageNumber", pageNumber);
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

  /*To Prevent F12*/
  useEffect(() => {
    document.onkeydown = (event) => {
      if (event.key == "F12") {
        // Prevent F12
        return false;
      } else if (event.ctrlKey && event.shiftKey && event.key == "i") {
        // Prevent Ctrl+Shift+I
        return false;
      }
    };
  }, []);

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
    <Box>
      <Button
        variant="outlined"
        size="small"
        startIcon={<KeyboardBackspaceIcon />}
        sx={{ mb: 3 }}
      >
        My bookshelf
      </Button>

      {/* Render epub file into browser view */}
      {fileType === "epub" && (
        <Box
          sx={{
            width: 600,
            height: "88vh"
          }}
        >
          <ReactReader
            location={location}
            locationChanged={locationChanged}
            url={LINK_EPUB}
            swipeable
            getRendition={(rendition) => (renditionRef.current = rendition)}
            tocChanged={(toc) => (tocRef.current = toc)}
            epubInitOptions={{
              openAs: "epub"
            }}
          />
          <PageIndicator page={page} />
        </Box>
      )}

      {/* Render pdf file into browser view */}
      {fileType === "pdf" && (
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
          <Document file={LINK_PDF} onLoadSuccess={onDocumentLoadSuccess}>
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
            <IconButton disabled={pageNumber >= numPages} onClick={nextPage}>
              <ChevronRightIcon />
            </IconButton>
          </Stack>
          {/* 
          <Box sx={{ position: "absolute", top: 0 }}>
            <IconButton disabled={pageNumber <= 1} onClick={previousPage}>
              <ChevronLeftIcon />
            </IconButton>
            <IconButton disabled={pageNumber >= numPages} onClick={nextPage}>
              <ChevronRightIcon />
            </IconButton>
          </Box> */}
        </Box>
      )}
    </Box>
  );
};

ReadBook.PageLayout = ZenLayout;

export default ReadBook;
