import { Box, Grid, Stack, Typography } from "@mui/material";

import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import Link from "next/link";

type BookPriceHistory = {
  highest: number;
  lowest: number;
  average: number;
  lastest: number;
};

type NftBookDetails = {
  contractAddress: string;
  bookId: string;
  pageNumber: number;
  languages: string[];
  statistics: any[] | [];
  desc: string;
  price?: string | number;
  countdown?: string;
  isOpen?: boolean;
  genres: string[];
};

type BookDetails = {} & BookItemProps;

const BookDetails = () => {
  return (
    <>
      <Typography variant="h2">The Giver</Typography>

      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>By</Typography>
        <Link href="#">
          <Typography variant="h6" color="secondary">
            Lois Amstrong
          </Typography>
        </Link>
        {/* <Stack key={i} direction="row" spacing={1}>
          {(() => {
            switch (stat.content) {
              case "views":
                return <VisibilityOutlinedIcon />;
              case "registered":
                return <PeopleAltOutlinedIcon />;
              default:
                return "";
            }
          })()}
          <Typography>{stat.value}</Typography>
          <Typography>{stat.content}</Typography>
        </Stack> */}
      </Stack>
    </>
  );
};

export default BookDetails;
