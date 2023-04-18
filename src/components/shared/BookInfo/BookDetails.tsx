// [DEPRECATED]
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  Box,
  Button,
  Divider,
  Grid,
  InputAdornment,
  Link as MUILink,
  Stack,
  Typography
} from "@mui/material";
import TextField from "@mui/material/TextField";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import Link from "next/link";
import * as yup from "yup";

import { useGenres, useLanguages } from "@/components/hooks/api";
import { useCountdown } from "@/components/hooks/common";
import { StyledButton } from "@/styles/components/Button";
import { ListedBook, NftBook, NftBookDetails } from "@/types/nftBook";

import { FormGroup } from "../FormGroup";
import { ReadMore } from "../ReadMore";
import { Timer } from "../Timer";

type BookDetailsProps = {
  onClick: () => void;
  bookDetail: NftBookDetails;
};

const schema = yup
  .object({
    listingPrice: yup
      .number()
      .required("Please enter the listing price")
      .typeError("The listing price must be a positive number")
      .positive("The listing price must be a positive number"),
    quantity: yup
      .number()
      .required("Please enter the quantity")
      .typeError("The quantity must be a positive integer")
      .positive("The quantity must be a positive integer")
      .integer("The quantity must be a positive integer")
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const BookDetails = ({ bookDetail, onClick }: BookDetailsProps) => {
  const genres = useGenres();
  const languages = useLanguages();

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues
  } = useForm<FormData>({
    defaultValues: {
      listingPrice: 0.5,
      quantity: 1
    },
    resolver: yupResolver(schema)
  });
  // const [days, hours, minutes, seconds] = useCountdown("2023/02/16");
  const [days, hours, minutes, seconds] = useCountdown("2023/3/16");
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [authorName, setAuthorName] = useState();
  const isPublished = bookDetail?.listedCore ? true : false;
  const isSelled = bookDetail?.nftCore?.balance > 0 ? false : true;

  const onSubmitSeller = (data: any) => {
    console.log("data:", data);

    // handle set isListing is true
  };

  useEffect(() => {
    setCountdown({ days, hours, minutes, seconds });
  }, [days, hours, minutes, seconds]);

  useEffect(() => {
    (async () => {
      console.log("bookDetail", bookDetail);

      try {
        if (bookDetail && bookDetail?.nftCore) {
          const userRes = await axios.get(
            `/api/users/wallet/${bookDetail.nftCore?.author}`
          );

          if (userRes.data.success === true) {
            setAuthorName(userRes.data.data.fullname);
          }
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [bookDetail]);

  return (
    <>
      <Box component="section">
        <Stack spacing={3}>
          {/* Title */}
          <Typography variant="h2">{bookDetail?.meta?.title}</Typography>

          {/* Attributes */}
          {/* {!isSelled && (
            <Stack direction="row" spacing={2}>
              {meta?.attributes.map((stat, i) => {
                switch (stat.statType) {
                  case "views":
                    return (
                      <Stack key={stat.statType} direction="row" spacing={0.5}>
                        <VisibilityOutlinedIcon color="primary" />
                        <Typography>{`${stat.value} ${stat.statType}`}</Typography>
                      </Stack>
                    );
                  case "owners":
                    return (
                      <Stack key={stat.statType} direction="row" spacing={0.5}>
                        <PeopleAltOutlinedIcon color="primary" />
                        <Typography>{`${stat.value} ${stat.statType}`}</Typography>
                      </Stack>
                    );
                  default:
                    return "";
                }
              })}
            </Stack>
          )} */}

          {/* Author */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>By</Typography>
            <Link href="#">
              <Typography variant="h6" color="secondary">
                {authorName}
              </Typography>
            </Link>
          </Stack>

          {/* Contract address */}
          {!isSelled && (
            <>
              <Stack>
                <Typography variant="label" mb={1}>
                  Contract address:
                </Typography>
                <MUILink href="#">{bookDetail?.info.contractAddress}</MUILink>
              </Stack>

              {/* Description */}
              <Stack sx={{ maxWidth: "500px" }}>
                <Typography variant="label" mb={1}>
                  Description:
                </Typography>
                {/* <>
              {bookDetail?.desc.split("\n").map((paragraph, i) => (
                <Typography key={i} gutterBottom>
                  {paragraph}
                </Typography>
              ))}
            </> */}
                {/* <ReadMore>{bookDetail!.desc}</ReadMore> */}

                <ReadMore>
                  {bookDetail?.info.description
                    .split("\n")
                    .map((paragraph, i) => (
                      <Typography key={i} gutterBottom>
                        {paragraph}
                      </Typography>
                    ))}
                </ReadMore>
              </Stack>
            </>
          )}

          {/* Read sample */}
          {!isPublished && (
            <>
              <Box>
                <StyledButton customVariant="secondary" size="small">
                  Read sample
                </StyledButton>
              </Box>

              {/* Countdown [dep] */}
              <Stack>
                <Typography variant="label" mb={1}>
                  Registration closes in:
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Timer value={countdown.days} type="days" typoVariant="h6" />:
                  <Timer value={countdown.hours} typoVariant="h6" />:
                  <Timer value={countdown.minutes} typoVariant="h6" />:
                  <Timer value={countdown.seconds} typoVariant="h6" />
                </Stack>
              </Stack>

              {/* Price [dep] */}
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h4">
                  {bookDetail?.listedCore?.price} ETH
                </Typography>
                {/* <Typography>(0.59489412 USD)</Typography> */}
              </Stack>

              {/* "Register now" button / "Add to watchlist" button */}
              <Stack direction="row" spacing={2}>
                <StyledButton customVariant="primary">
                  Register now
                </StyledButton>
                <StyledButton customVariant="secondary">
                  + Add to watchlist
                </StyledButton>
                <Button variant="outlined">
                  <InsertDriveFileIcon color="primary" />
                </Button>
              </Stack>

              {/* Trade-in/Borrow navigate */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography>You don’t want to own this book?</Typography>
                <MUILink href="#">Go to borrow</MUILink>
              </Stack>
            </>
          )}

          {/* {isPublished && !isSelled && (
            <Stack direction="row" spacing={2}>
              <StyledButton customVariant="secondary">Edit book</StyledButton>
              {isListing ? (
                <StyledButton customVariant="primary" onClick={() => {}}>
                  Edit listing
                </StyledButton>
              ) : (
                <StyledButton
                  customVariant="primary"
                  onClick={() => setIsSelled(true)}
                >
                  Sell
                </StyledButton>
              )}
            </Stack>
          )} */}

          {/* {isPublished && isSelled && (
            <>
              <Stack direction="column" spacing={2}>
                <FormGroup label="Listing price" required>
                  <Controller
                    name="listingPrice"
                    control={control}
                    render={({ field }) => {
                      return (
                        <TextField
                          id="listingPrice"
                          type="number"
                          fullWidth
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                ETH
                              </InputAdornment>
                            )
                          }}
                          error={!!errors.listingPrice?.message}
                          {...field}
                        />
                      );
                    }}
                  />
                </FormGroup>
                <FormGroup label="Quantity" required>
                  <Controller
                    name="quantity"
                    control={control}
                    render={({ field }) => {
                      return (
                        <TextField
                          id="quantity"
                          type="number"
                          fullWidth
                          error={!!errors.quantity?.message}
                          {...field}
                        />
                      );
                    }}
                  />
                </FormGroup>
              </Stack>

              <Stack direction="row" spacing={2}>
                <StyledButton
                  customVariant="secondary"
                  onClick={() => setIsSelled(false)}
                >
                  Cancel
                </StyledButton>
                <StyledButton
                  customVariant="primary"
                  type="submit"
                  onClick={handleSubmit(onSubmitSeller)}
                >
                  Start listing
                </StyledButton>
              </Stack>
            </>
          )} */}
        </Stack>
      </Box>

      {!isSelled && (
        <>
          <Divider sx={{ my: 6 }} />

          <Stack component="section">
            <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={3}>
              <Grid item xs={4} sm={8} md={6}>
                {/* Nft book details */}
                <Stack spacing={2}>
                  <Typography variant="h5" mb={1}>
                    NFT Book details
                  </Typography>

                  {/* Book id */}
                  <Stack direction="row" spacing={1}>
                    <Typography variant="label">Book ID:</Typography>
                    <Typography>#{bookDetail?.bookId}</Typography>
                  </Stack>

                  {/* Book id */}
                  <Stack direction="row" spacing={1}>
                    <Typography variant="label">File:</Typography>
                    <Typography>{bookDetail?.meta?.fileType}</Typography>
                  </Stack>

                  {/* № page */}
                  <Stack direction="row" spacing={1}>
                    <Typography variant="label">№ pages:</Typography>
                    <Typography>{bookDetail?.info?.totalPages}</Typography>
                  </Stack>

                  {/* Write in Language */}
                  <Stack direction="row" spacing={1}>
                    <Typography variant="label">Languages:</Typography>
                    <Typography>
                      {!languages.isLoading &&
                        languages.data &&
                        languages.data
                          .filter((language: any) =>
                            bookDetail?.info?.languages.includes(language._id)
                          )
                          .map((languages: any) => languages.name)
                          .join(" | ")}
                      {/* {bookDetail?.info?.languages?.join(" | ")} */}
                    </Typography>
                  </Stack>

                  {/* Genres */}
                  <Stack direction="row" spacing={1}>
                    <Typography variant="label">Genres:</Typography>
                    <Typography>
                      {!genres.isLoading &&
                        genres.data &&
                        genres.data
                          .filter((genre: any) =>
                            bookDetail?.info?.genres.includes(genre._id)
                          )
                          .map((genres: any) => genres.name)
                          .join(" | ")}
                      {/* {bookDetail?.info?.genres?.join(" | ")} */}
                    </Typography>
                  </Stack>

                  {/* Edition version */}
                  <Stack direction="row" spacing={1}>
                    <Typography variant="label">Edition version:</Typography>
                    <Typography>{bookDetail?.info.version}</Typography>
                  </Stack>

                  {/* Max supply */}
                  <Stack direction="row" spacing={1}>
                    <Typography variant="label">Max supply:</Typography>
                    <Typography>{bookDetail?.info.maxSupply}</Typography>
                  </Stack>

                  {/* Owners */}
                  {/* <Stack direction="row" spacing={1}>
                    <Typography variant="label">Owners:</Typography>
                    <Typography>
                      {bookDetail?.listedCore
                        ? bookDetail.listedCore.seller
                        : bookDetail.nftCore.author}
                    </Typography>
                  </Stack> */}

                  {/* Open on */}
                  {/* <Stack direction="row" spacing={1}>
                    <Typography variant="label">
                      Open publication on:
                    </Typography>
                    <Typography>
                      {details?.info?.openDate.toLocaleDateString("en-US")}
                      {bookDetail?.info.openDate.toLocaleDateString("en-US")}
                    </Typography>
                  </Stack> */}

                  {/* End on */}
                  {/* <Stack direction="row" spacing={1}>
                    <Typography variant="label">End publication on:</Typography>
                    <Typography>
                      {details?.info?.endDate.toLocaleDateString("en-US")}
                    </Typography>
                  </Stack> */}
                </Stack>
              </Grid>
              <Grid item xs={4} sm={8} md={6}>
                <Stack spacing={2}>
                  {/* Sale / rental pricing history */}
                  <Typography variant="h5" mb={1}>
                    Sale pricing history
                  </Typography>

                  {/* Highest */}
                  <Stack direction="row" spacing={1}>
                    <Typography variant="label">Highest:</Typography>
                    <Typography>0.5 ETH</Typography>
                  </Stack>

                  {/* Lowest */}
                  <Stack direction="row" spacing={1}>
                    <Typography variant="label">Lowest:</Typography>
                    <Typography>0.5 ETH</Typography>
                  </Stack>

                  {/* Average */}
                  <Stack direction="row" spacing={1}>
                    <Typography variant="label">Average:</Typography>
                    <Typography>0.5 ETH</Typography>
                  </Stack>

                  {/* Lasted */}
                  <Stack direction="row" spacing={1}>
                    <Typography variant="label">Lasted:</Typography>
                    <Typography>0.5 ETH</Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </>
      )}
    </>
  );
};

export default BookDetails;
