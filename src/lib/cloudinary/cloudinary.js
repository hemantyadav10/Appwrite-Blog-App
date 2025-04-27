import { defaultImage } from "@cloudinary/url-gen/actions/delivery";
import { Cloudinary } from "@cloudinary/url-gen/index";
import axios from "axios";

// Set up Cloudinary instance
const cld = new Cloudinary({
  cloud: {
    cloudName: String(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME)
  }
});

const getCloudinaryImage = (publicId) => {
  if (!publicId) return null;
  const image = cld.image(publicId);

  image
    .quality('auto')
    .format('auto')
    .delivery(defaultImage("infiniteInk_fallback"))

  return image;
};

const uploadToCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', String(import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET));

    const response = await axios.post(`https://api.cloudinary.com/v1_1/${String(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME)}/upload`, formData);

    return response.data;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return null;
  }
}

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await axios.post(`${import.meta.env.VITE_BASE_URL}/delete-image`, {
      public_id: publicId,
    });

    console.log(result.data);

    return result.data;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return null;
  }
}

export default cld;
export {
  getCloudinaryImage,
  uploadToCloudinary,
  deleteFromCloudinary
}