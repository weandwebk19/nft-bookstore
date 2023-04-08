import { Box } from "@mui/material";

import { Image } from "../Image";

interface BookTicketProps {
  image: string;
  title: string;
}

const BookTicket = ({ image, title }: BookTicketProps) => {
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Image src={image} alt={image} />
    </Box>
  );
};

export default BookTicket;
