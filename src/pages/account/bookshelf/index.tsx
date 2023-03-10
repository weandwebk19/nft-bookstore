import { Stack, Typography } from "@mui/material";

import images from "@/assets/images";
import { BookTicket } from "@/components/shared/BookTicket";
import { ContentContainer } from "@/components/shared/ContentContainer";
import { Wrapper } from "@/components/shared/Wrapper";

const preUrl = "/account/bookshelf";

const topCategories = [
  {
    id: `${preUrl}/created-books`,
    component: (
      <BookTicket
        href={`${preUrl}/created-books`}
        header="Created books"
        image={images.product1}
      />
    )
  },
  {
    id: `${preUrl}/owned-books`,
    component: (
      <BookTicket
        href={`${preUrl}/owned-books`}
        header="Owned books"
        image={images.product2}
      />
    )
  },
  {
    id: `${preUrl}/rental-books`,
    component: (
      <BookTicket
        href={`${preUrl}/rental-books`}
        header="Rental books"
        image={images.product3}
      />
    )
  },
  {
    component: (
      <>
        <Typography variant="h3" sx={{ textAlign: "end" }}>
          Never stop reading
        </Typography>
      </>
    )
  }
];

const bottomCategories = [
  {
    id: "",
    component: (
      <Typography variant="h3">
        Keep track of the books you&apos;ve listed...
      </Typography>
    )
  },
  {
    component: <></>
  },
  {
    id: `${preUrl}/listing-books`,
    component: (
      <BookTicket
        href={`${preUrl}/listing-books`}
        header="Listing books"
        image={images.product1}
      />
    )
  },
  {
    id: `${preUrl}/books-for-rent`,
    component: (
      <BookTicket
        href={`${preUrl}/books-for-rent`}
        header="Books for rent"
        image={images.product1}
      />
    )
  }
];

const BookShelf = () => {
  return (
    <Stack spacing={6}>
      <ContentContainer titles={["My bookshelf"]}>
        <Wrapper items={topCategories} itemsInARow={4} />
        <Wrapper items={bottomCategories} itemsInARow={4} />
      </ContentContainer>
    </Stack>
  );
};

export default BookShelf;
