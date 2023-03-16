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

import { useCountdown } from "@/components/hooks/common";
import { book2 } from "@/mocks";
import { StyledButton } from "@/styles/components/Button";
import { NftBook } from "@/types/nftBook";
import { NftBookDetails } from "@/types/nftBook";

import { FormGroup } from "../FormGroup";
import { ReadMore } from "../ReadMore";
import { Timer } from "../Timer";
import { BookBriefing, BookDetail } from "./sections";

type BookInfoProps = {
  onClick?: () => void;
  bookDetail: NftBookDetails;
};

const BookInfo = ({ bookDetail }: BookInfoProps) => {
  const [authorName, setAuthorName] = useState<string>("");
  const isPublished = bookDetail?.listedCore ? true : false;
  const isSelled = bookDetail?.nftCore?.quantity > 0 ? false : true;

  useEffect(() => {
    (async () => {
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
    <Stack>
      <BookBriefing
        tokenId={bookDetail?.nftCore.tokenId}
        isOpenForSale={isPublished}
        isOpenForTradeIn={false}
        isOpenForBorrow={false}
        title={bookDetail?.meta.title}
        author={bookDetail?.nftCore.author}
        authorName={authorName}
        contractAddress={bookDetail?.info.contractAddress}
        description={bookDetail?.info.description}
        bookSample={bookDetail?.meta.bookSample}
        price={bookDetail?.listedCore?.price}
      />
      <Divider sx={{ my: 6 }} />
      <BookDetail
        bookId={bookDetail?.bookId}
        fileType={bookDetail?.meta.fileType}
        totalPages={bookDetail?.info.totalPages}
        languages={bookDetail?.info.languages}
        genres={bookDetail?.info.genres}
        version={bookDetail?.meta.version}
        maxSupply={bookDetail?.meta.quantity}
        publishingTime={bookDetail?.info.publishingTime}
        owners={
          bookDetail?.listedCore !== null
            ? bookDetail?.listedCore?.seller
            : bookDetail?.meta.author
        }
      />
    </Stack>
    // <>
    //       {isPublished && !isSelled && (
    //         <Stack direction="row" spacing={2}>
    //           <StyledButton customVariant="secondary">Edit book</StyledButton>
    //           {isListed ? (
    //             <StyledButton customVariant="primary" onClick={() => {}}>
    //               Edit listing
    //             </StyledButton>
    //           ) : (
    //             <StyledButton
    //               customVariant="primary"
    //               onClick={() => setIsSelled(true)}
    //             >
    //               Sell
    //             </StyledButton>
    //           )}
    //         </Stack>
    //       )}

    //       {isPublished && isSelled && (
    //         <>
    //           <Stack direction="column" spacing={2}>
    //             <FormGroup label="Listing price" required>
    //               <Controller
    //                 name="listingPrice"
    //                 control={control}
    //                 render={({ field }) => {
    //                   return (
    //                     <TextField
    //                       id="listingPrice"
    //                       type="number"
    //                       fullWidth
    //                       InputProps={{
    //                         endAdornment: (
    //                           <InputAdornment position="end">
    //                             ETH
    //                           </InputAdornment>
    //                         )
    //                       }}
    //                       error={!!errors.listingPrice?.message}
    //                       {...field}
    //                     />
    //                   );
    //                 }}
    //               />
    //             </FormGroup>
    //             <FormGroup label="Quantity" required>
    //               <Controller
    //                 name="quantity"
    //                 control={control}
    //                 render={({ field }) => {
    //                   return (
    //                     <TextField
    //                       id="quantity"
    //                       type="number"
    //                       fullWidth
    //                       error={!!errors.quantity?.message}
    //                       {...field}
    //                     />
    //                   );
    //                 }}
    //               />
    //             </FormGroup>
    //           </Stack>

    //           <Stack direction="row" spacing={2}>
    //             <StyledButton
    //               customVariant="secondary"
    //               onClick={() => setIsSelled(false)}
    //             >
    //               Cancel
    //             </StyledButton>
    //             <StyledButton
    //               customVariant="primary"
    //               type="submit"
    //               onClick={handleSubmit(onSubmitSeller)}
    //             >
    //               Start listing
    //             </StyledButton>
    //           </Stack>
    //         </>
    //       )}
    //     </Stack>
    //   </Box>

    //   {!isSelled && (
    //     <>
    //       <Divider sx={{ my: 6 }} />

    //       <Stack component="section">
    //         <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={3}>
    //           <Grid item xs={4} sm={8} md={6}>
    //             {/* Nft book details */}
    //             <Stack spacing={2}>
    //               <Typography variant="h5" mb={1}>
    //                 NFT Book details
    //               </Typography>

    //               {/* Book id */}
    //               <Stack direction="row" spacing={1}>
    //                 <Typography variant="label">Book ID:</Typography>
    //                 <Typography>#{details?.bookId}</Typography>
    //               </Stack>

    //               {/* Book id */}
    //               <Stack direction="row" spacing={1}>
    //                 <Typography variant="label">File:</Typography>
    //                 <Typography>{meta?.file}</Typography>
    //               </Stack>

    //               {/* № page */}
    //               <Stack direction="row" spacing={1}>
    //                 <Typography variant="label">№ pages:</Typography>
    //                 <Typography>{details?.pages}</Typography>
    //               </Stack>

    //               {/* Write in Language */}
    //               <Stack direction="row" spacing={1}>
    //                 <Typography variant="label">Languages:</Typography>
    //                 <Typography>{details?.language.join(" | ")}</Typography>
    //               </Stack>

    //               {/* Genres */}
    //               <Stack direction="row" spacing={1}>
    //                 <Typography variant="label">Genres:</Typography>
    //                 <Typography>{details?.genres.join(" | ")}</Typography>
    //               </Stack>

    //               {/* Edition version */}
    //               <Stack direction="row" spacing={1}>
    //                 <Typography variant="label">Edition version:</Typography>
    //                 <Typography>{details?.editionVersion}</Typography>
    //               </Stack>

    //               {/* Max supply */}
    //               <Stack direction="row" spacing={1}>
    //                 <Typography variant="label">Max supply:</Typography>
    //                 <Typography>{details?.maxSupply}</Typography>
    //               </Stack>

    //               {/* Owners */}
    //               <Stack direction="row" spacing={1}>
    //                 <Typography variant="label">Owners:</Typography>
    //                 <Typography>
    //                   {
    //                     meta?.attributes.find(
    //                       (attr) => attr.statType === "owners"
    //                     )?.value
    //                   }
    //                 </Typography>
    //               </Stack>

    //               {/* Open on */}
    //               <Stack direction="row" spacing={1}>
    //                 <Typography variant="label">
    //                   Open publication on:
    //                 </Typography>
    //                 <Typography>
    //                   {details?.openDate.toLocaleDateString("en-US")}
    //                 </Typography>
    //               </Stack>

    //               {/* End on */}
    //               <Stack direction="row" spacing={1}>
    //                 <Typography variant="label">End publication on:</Typography>
    //                 <Typography>
    //                   {details?.endDate.toLocaleDateString("en-US")}
    //                 </Typography>
    //               </Stack>
    //             </Stack>
    //           </Grid>
    //           <Grid item xs={4} sm={8} md={6}>
    //             <Stack spacing={2}>
    //               {/* Sale / rental pricing history */}
    //               <Typography variant="h5" mb={1}>
    //                 Sale pricing history
    //               </Typography>

    //               {/* Highest */}
    //               <Stack direction="row" spacing={1}>
    //                 <Typography variant="label">Highest:</Typography>
    //                 <Typography>0.5 ETH</Typography>
    //               </Stack>

    //               {/* Lowest */}
    //               <Stack direction="row" spacing={1}>
    //                 <Typography variant="label">Lowest:</Typography>
    //                 <Typography>0.5 ETH</Typography>
    //               </Stack>

    //               {/* Average */}
    //               <Stack direction="row" spacing={1}>
    //                 <Typography variant="label">Average:</Typography>
    //                 <Typography>0.5 ETH</Typography>
    //               </Stack>

    //               {/* Lasted */}
    //               <Stack direction="row" spacing={1}>
    //                 <Typography variant="label">Lasted:</Typography>
    //                 <Typography>0.5 ETH</Typography>
    //               </Stack>
    //             </Stack>
    //           </Grid>
    //         </Grid>
    //       </Stack>
    //     </>
    //   )}
    // </>
  );
};

export default BookInfo;
