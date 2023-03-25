import cloudinary from "cloudinary";

const fs = require("fs");

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = async (imagePath: any) => {
  const options = {
    use_filename: true,
    folder: "NftBookStore"
  };

  try {
    // Upload the image
    const result = await cloudinary.v2.uploader.upload(imagePath, options);

    //delete image in local
    fs.unlinkSync(imagePath);

    //return url
    return result.url;
  } catch (error) {
    console.error(error);
  }
};

module.exports = uploadImage;
