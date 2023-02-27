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
import Link from "next/link";
import * as yup from "yup";

import { useCountdown } from "@/components/hooks/common/useCountdown";
import { StyledButton } from "@/styles/components/Button";
import { NftBook } from "@/types/nftBook";

import { FormGroup } from "../FormGroup";
import { ReadMore } from "../ReadMore";
import { Timer } from "../Timer";

type BookDetailsProps = {
  onClick: () => void;
  isListed: boolean;
  isPublished: boolean;
  isSelled: boolean;
  setIsSelled: (flag: boolean) => void;
} & NftBook;

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

const BookDetails = ({
  tokenId,
  price,
  meta,
  details,
  author,
  isListed,
  onClick,
  isPublished,
  isSelled,
  setIsSelled
}: BookDetailsProps) => {
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
  const [days, hours, minutes, seconds] = useCountdown("2023/02/16");
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const onSubmitSeller = (data: any) => {
    console.log("data:", data);

    // handle set isListed is true
  };

  useEffect(() => {
    setCountdown({ days, hours, minutes, seconds });
  }, [days, hours, minutes, seconds]);

  return (
    <>
      <Box component="section">
        <Stack spacing={3}>
          {/* Title */}
          <Typography variant="h2">The Giver</Typography>

          {/* Attributes */}
          {!isSelled && (
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
          )}

          {/* Author */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>By</Typography>
            <Link href="#">
              <Typography variant="h6" color="secondary">
                Lois Amstrong
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
                <MUILink href="#">{details?.contractAddress}</MUILink>
              </Stack>

              {/* Description */}
              <Stack sx={{ maxWidth: "500px" }}>
                <Typography variant="label" mb={1}>
                  Description:
                </Typography>
                {/* <>
              {details?.desc.split("\n").map((paragraph, i) => (
                <Typography key={i} gutterBottom>
                  {paragraph}
                </Typography>
              ))}
            </> */}
                {/* <ReadMore>{details!.desc}</ReadMore> */}

                <ReadMore>
                  {details?.desc.split("\n").map((paragraph, i) => (
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
                <Typography variant="h4">{price} ETH</Typography>
                <Typography>(0.59489412 USD)</Typography>
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

          {isPublished && !isSelled && (
            <Stack direction="row" spacing={2}>
              <StyledButton customVariant="secondary">Edit book</StyledButton>
              {isListed ? (
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
          )}

          {isPublished && isSelled && (
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
          )}
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
                    <Typography>#{details?.bookId}</Typography>
                  </Stack>

                  {/* Book id */}
                  <Stack direction="row" spacing={1}>
                    <Typography variant="label">File:</Typography>
                    <Typography>{meta?.file}</Typography>
                  </Stack>

                  {/* № page */}
                  <Stack direction="row" spacing={1}>
                    <Typography variant="label">№ pages:</Typography>
                    <Typography>{details?.pages}</Typography>
                  </Stack>

                  {/* Write in Language */}
                  <Stack direction="row" spacing={1}>
                    <Typography variant="label">Languages:</Typography>
                    <Typography>{details?.language.join(" | ")}</Typography>
                  </Stack>

                  {/* Genres */}
                  <Stack direction="row" spacing={1}>
                    <Typography variant="label">Genres:</Typography>
                    <Typography>{details?.genres.join(" | ")}</Typography>
                  </Stack>

                  {/* Edition version */}
                  <Stack direction="row" spacing={1}>
                    <Typography variant="label">Edition version:</Typography>
                    <Typography>{details?.editionVersion}</Typography>
                  </Stack>

                  {/* Max supply */}
                  <Stack direction="row" spacing={1}>
                    <Typography variant="label">Max supply:</Typography>
                    <Typography>{details?.maxSupply}</Typography>
                  </Stack>

                  {/* Owners */}
                  <Stack direction="row" spacing={1}>
                    <Typography variant="label">Owners:</Typography>
                    <Typography>
                      {
                        meta?.attributes.find(
                          (attr) => attr.statType === "owners"
                        )?.value
                      }
                    </Typography>
                  </Stack>

                  {/* Open on */}
                  <Stack direction="row" spacing={1}>
                    <Typography variant="label">
                      Open publication on:
                    </Typography>
                    <Typography>
                      {details?.openDate.toLocaleDateString("en-US")}
                    </Typography>
                  </Stack>

                  {/* End on */}
                  <Stack direction="row" spacing={1}>
                    <Typography variant="label">End publication on:</Typography>
                    <Typography>
                      {details?.endDate.toLocaleDateString("en-US")}
                    </Typography>
                  </Stack>
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
