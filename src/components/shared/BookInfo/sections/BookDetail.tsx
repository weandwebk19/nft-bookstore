import { Box, Chip, Stack, Typography } from "@mui/material";

import { useTranslation } from "next-i18next";

interface BookDetailProps {
  bookId: string;
  fileType: string;
  totalPages: number | undefined;
  languages: string[];
  genres: string[];
  version: string | number;
  maxSupply: number;
  publishingTime: Date | undefined;
  owners: string | string[];
  keywords?: string | string[];
}

const BookDetail = ({
  bookId,
  fileType,
  totalPages,
  languages,
  genres,
  version,
  maxSupply,
  publishingTime,
  owners,
  keywords
}: BookDetailProps) => {
  const { t } = useTranslation("bookDetail");

  return (
    <>
      {/* Nft book details */}
      <Stack spacing={2}>
        <Typography variant="h5" mb={1}>
          {t("nftBookDetail")}
        </Typography>

        {/* Book id */}
        <Stack direction="row" spacing={1}>
          <Typography variant="label">{t("bookId")}:</Typography>
          <Typography>#{bookId}</Typography>
        </Stack>

        {/* File type */}
        <Stack direction="row" spacing={1}>
          <Typography variant="label">{t("file")}:</Typography>
          <Typography>{fileType}</Typography>
        </Stack>

        {/* № page */}
        <Stack direction="row" spacing={1}>
          <Typography variant="label">{t("noPages")}:</Typography>
          <Typography>{totalPages}</Typography>
        </Stack>

        {/* Write in Language */}
        <Stack direction="row" spacing={1}>
          <Typography variant="label">{t("languages")}:</Typography>
          <Typography>
            {/* {fetchedLanguages.data
              ?.filter((language: any) => languages?.includes(language._id))
              .map((languages: any) => languages.name)
              .join(" | ")} */}
            {languages?.join(" | ")}
          </Typography>
        </Stack>

        {/* Genres */}
        <Stack direction="row" spacing={1}>
          <Typography variant="label">{t("genres")}:</Typography>
          <Typography>
            {/* {fetchedGenres.data
              ?.filter((genre: any) => genres?.includes(genre._id))
              .map((genres: any) => genres.name)
              .join(" | ")} */}
            {genres?.join(" | ")}
          </Typography>
        </Stack>

        {/* Keywords */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="label">{t("keywords")}:</Typography>
          <Box>
            {(() => {
              if (typeof keywords === "string") {
                return <Typography>{keywords}</Typography>;
              }
              return keywords?.map((keyword) => {
                return (
                  <Chip
                    key={keyword}
                    label={<Typography>{keyword}</Typography>}
                    sx={{ m: 0.5 }}
                  />
                );
              });

              // return keywords?.join(" | ");
            })()}
          </Box>
        </Stack>

        {/* Edition version */}
        <Stack direction="row" spacing={1}>
          <Typography variant="label">{t("editionVersion")}:</Typography>
          <Typography>{version}</Typography>
        </Stack>

        {/* Max supply */}
        <Stack direction="row" spacing={1}>
          <Typography variant="label">{t("quantity")}:</Typography>
          <Typography>{maxSupply}</Typography>
        </Stack>

        {/* Owners */}
        <Stack spacing={1}>
          <Typography variant="label">{t("owners")}:</Typography>
          <Box sx={{ wordWrap: "break-word", width: "100%" }}>
            <Typography>{owners}</Typography>
          </Box>
        </Stack>

        {/* Open on */}
        <Stack direction="row" spacing={1}>
          <Typography variant="label">{t("publishedDate")}:</Typography>
          <Typography>{publishingTime?.toLocaleDateString("en-US")}</Typography>
        </Stack>

        {/* End on */}
        {/* <Stack direction="row" spacing={1}>
          <Typography variant="label">End publication on:</Typography>
          <Typography>
            {details?.endDate.toLocaleDateString("en-US")}
          </Typography>
        </Stack> */}
      </Stack>
    </>
  );
};

export default BookDetail;
