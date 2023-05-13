import { Box, Chip, Stack, Typography } from "@mui/material";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { useBookInfo } from "@/components/hooks/api";
import { useNftBookMeta } from "@/components/hooks/web3";

const BookDetail = () => {
  const { t } = useTranslation("bookDetail");
  const router = useRouter();
  const { bookId, seller } = router.query;
  const { nftBookMeta } = useNftBookMeta(bookId as string);
  const bookInfo = useBookInfo(bookId as string);

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
          <Typography>{nftBookMeta.data?.fileType}</Typography>
        </Stack>

        {/* № page */}
        <Stack direction="row" spacing={1}>
          <Typography variant="label">{t("noPages")}:</Typography>
          <Typography>{bookInfo.data?.totalPages}</Typography>
        </Stack>

        {/* Write in Language */}
        <Stack direction="row" spacing={1}>
          <Typography variant="label">{t("languages")}:</Typography>
          <Typography>
            {/* {fetchedLanguages.data
              ?.filter((language: any) => languages?.includes(language._id))
              .map((languages: any) => languages.name)
              .join(" | ")} */}
            {bookInfo.data?.languages?.join(" | ")}
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
            {bookInfo.data?.genres?.join(" | ")}
          </Typography>
        </Stack>

        {/* Keywords */}
        {bookInfo.data?.keywords.length > 0 && (
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="label">{t("keywords")}:</Typography>
            <Box>
              {bookInfo.data?.keywords?.map((keyword: any) => {
                return (
                  <Chip
                    key={keyword}
                    label={<Typography>{keyword}</Typography>}
                    sx={{ m: 0.5 }}
                  />
                );
              })}
            </Box>
          </Stack>
        )}

        {/* Edition version */}
        <Stack direction="row" spacing={1}>
          <Typography variant="label">{t("editionVersion")}:</Typography>
          <Typography>{nftBookMeta.data?.version}</Typography>
        </Stack>

        {/* Max supply */}
        <Stack direction="row" spacing={1}>
          <Typography variant="label">{t("quantity")}:</Typography>
          <Typography>{nftBookMeta.data?.quantity}</Typography>
        </Stack>

        {/* Owners */}
        <Stack spacing={1}>
          <Typography variant="label">{t("owners")}:</Typography>
          <Box sx={{ wordWrap: "break-word", width: "100%" }}>
            <Typography>
              {seller ? seller : nftBookMeta.data?.author}
            </Typography>
          </Box>
        </Stack>

        {/* Open on */}
        <Stack direction="row" spacing={1}>
          <Typography variant="label">{t("publishedDate")}:</Typography>
          <Typography>
            {new Date(nftBookMeta.data?.createdAt).toLocaleDateString("en-US")}
          </Typography>
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
