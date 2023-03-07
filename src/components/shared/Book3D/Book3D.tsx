import { Box } from "@mui/material";

interface Book3DProps {
  bookCover?: string;
  height?: string | number;
  width?: string | number;
  isTilted?: boolean;
}

const Book3D = ({
  bookCover = "green",
  height = "100%",
  width = "100%",
  isTilted = true
}: Book3DProps) => {
  // let img = new Image();
  // img.src = bookCover;
  // const imgHeight = img.height;
  // console.log(imgHeight);

  return (
    <Box
      className="Book3D"
      sx={{
        position: "relative",
        width: width,
        height: height,
        display: "flex",
        perspective: `${isTilted ? "1000px" : "-1"}`,
        alignItems: "center"
      }}
    >
      <Box
        className="book3d-bookcover"
        sx={{
          position: "absolute",
          width: `calc(${width} - 15px)`,
          height: `calc(${height} + 4px)`,
          backgroundImage: `url(${bookCover})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          borderTopRightRadius: "2px",
          borderBottomRightRadius: "2px",
          boxShadow: "10px 2px 20px -3px rgb(20 0 70 / 30%)",
          zIndex: "1",
          transform: "rotatey(-10deg) translateZ(-30px) translatex(12px)"
        }}
      ></Box>
      <Box
        className="book3d-pages"
        sx={{
          position: "absolute",
          width: width,
          height: height,
          background:
            "linear-gradient(to right,#fff 0,#fff 95%,#ccc 95.5%,#fff 96%,#ccc 96.5%,#fff 97%,#ccc 97.5%,#fff 98%,#ccc 98.5%,#fff 99%,#ccc 99.5%,#fff 100%)",
          borderTop: "solid 1px #aaa",
          borderRight: "solid 1px #aaa",
          borderBottom: "solid 1px #aaa",
          borderTopRightRadius: "5px",
          borderBottomRightRadius: "5px",
          borderLeft: "solid 5px black",
          transform: "rotatey(-10deg) translateZ(-20px) translatex(9px)"
        }}
      ></Box>
      <Box
        className="book3d-back"
        sx={{
          position: "absolute",
          width: width,
          height: height,
          background: "#09132c",
          borderTopRightRadius: "2px",
          borderBottomRightRadius: "2px",
          boxShadow: "10px 2px 20px -3px rgb(20 0 70 / 30%)",
          zIndex: -1,
          transform: "rotatey(-10deg) translateZ(-30px) translatex(12px)"
        }}
      ></Box>
    </Box>
  );
};

export default Book3D;
