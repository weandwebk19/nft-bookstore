import { Grid, Stack, Typography } from "@mui/material";

interface BookDetailProps {
  bookId: string;
  fileType: string;
  totalPages: number;
  languages: string[];
  genres: string[];
  version: string | number;
  maxSupply: number;
  publishingTime: Date;
  owners: string | string[];
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
  owners
}: BookDetailProps) => {
  return (
    <Grid item xs={4} sm={8} md={6}>
      {/* Nft book details */}
      <Stack spacing={2}>
        <Typography variant="h5" mb={1}>
          NFT Book details
        </Typography>

        {/* Book id */}
        <Stack direction="row" spacing={1}>
          <Typography variant="label">Book ID:</Typography>
          <Typography>#{bookId}</Typography>
        </Stack>

        {/* File type */}
        <Stack direction="row" spacing={1}>
          <Typography variant="label">File:</Typography>
          <Typography>{fileType}</Typography>
        </Stack>

        {/* № page */}
        <Stack direction="row" spacing={1}>
          <Typography variant="label">№ pages:</Typography>
          <Typography>{totalPages}</Typography>
        </Stack>

        {/* Write in Language */}
        <Stack direction="row" spacing={1}>
          <Typography variant="label">Languages:</Typography>
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
          <Typography variant="label">Genres:</Typography>
          <Typography>
            {/* {fetchedGenres.data
              ?.filter((genre: any) => genres?.includes(genre._id))
              .map((genres: any) => genres.name)
              .join(" | ")} */}
            {genres?.join(" | ")}
          </Typography>
        </Stack>

        {/* Edition version */}
        <Stack direction="row" spacing={1}>
          <Typography variant="label">Edition version:</Typography>
          <Typography>{version}</Typography>
        </Stack>

        {/* Max supply */}
        <Stack direction="row" spacing={1}>
          <Typography variant="label">Max supply:</Typography>
          <Typography>{maxSupply}</Typography>
        </Stack>

        {/* Owners */}
        <Stack direction="row" spacing={1}>
          <Typography variant="label">Owners:</Typography>
          <Typography>{owners}</Typography>
        </Stack>

        {/* Open on */}
        <Stack direction="row" spacing={1}>
          <Typography variant="label">Open publication on:</Typography>
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
    </Grid>
  );
};

export default BookDetail;
