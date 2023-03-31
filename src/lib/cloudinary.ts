import axios from "axios";
import cloudinary from "cloudinary";

// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_API_KEY,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "nft_bookstore");

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
    formData
  );
  console.log("res.data", res.data);

  return res.data;
};

// export const deleteImage = async (public_id: string) => {
//   cloudinary.v2.uploader
//     .destroy(public_id, function (error, result) {
//       console.log(result, error);
//     })
//     .then((resp) => console.log(resp))
//     .catch((_err) =>
//       console.log("Something went wrong, please try again later.")
//     );
// };
