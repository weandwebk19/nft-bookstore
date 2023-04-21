import { Grid } from "@mui/material";

type WrapperVariants = 2 | 3 | 4 | 6;

interface WrapperProps {
  itemsInARow?: WrapperVariants;
  items?: {
    component: JSX.Element;
  }[];
  children?: JSX.Element;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
}

const Wrapper = ({
  itemsInARow = 3,
  items,
  children,
  xs = 4,
  sm = 4,
  md = 4,
  lg = 3
}: WrapperProps) => {
  return (
    <Grid container columns={{ xs: 4, sm: 8, md: 12, lg: 12 }} spacing={3}>
      {(() => {
        if (children)
          return (
            <Grid item xs={xs} sm={sm} md={md} lg={lg}>
              {children}
            </Grid>
          );
        else
          return items?.map((item, i) => {
            if (itemsInARow === 3) {
              return (
                <Grid key={i} item xs={xs} sm={sm} md={4}>
                  {item.component}
                </Grid>
              );
            } else if (itemsInARow === 4) {
              return (
                <Grid key={i} item xs={xs} sm={sm} md={md} lg={3}>
                  {item.component}
                </Grid>
              );
            } else if (itemsInARow === 6) {
              return (
                <Grid key={i} item xs={xs} sm={sm} md={2}>
                  {item.component}
                </Grid>
              );
            } else if (itemsInARow === 2) {
              return (
                <Grid key={i} item xs={xs} sm={sm} md={6}>
                  {item.component}
                </Grid>
              );
            }
          });
      })()}
    </Grid>
  );
};

export default Wrapper;
