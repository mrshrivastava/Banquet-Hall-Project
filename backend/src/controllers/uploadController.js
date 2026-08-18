import { v2 as cloudinary } from 'cloudinary';

const supportedImage = /^data:image\/(jpeg|jpg|png|webp|gif);base64,/i;
const MAX_DATA_URL_LENGTH = 9 * 1024 * 1024;

const configureCloudinary = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    const error = new Error('Image uploads are not configured. Add your Cloudinary credentials to backend/.env.');
    error.status = 503;
    throw error;
  }
  cloudinary.config({ cloud_name: CLOUDINARY_CLOUD_NAME, api_key: CLOUDINARY_API_KEY, api_secret: CLOUDINARY_API_SECRET });
};

export const uploadVendorImage = async (req, res) => {
  const { image } = req.body;
  if (typeof image !== 'string' || !supportedImage.test(image)) return res.status(400).json({ message: 'Please upload a JPG, PNG, WEBP, or GIF image.' });
  if (image.length > MAX_DATA_URL_LENGTH) return res.status(413).json({ message: 'That image is too large. Please choose an image under 6 MB.' });

  configureCloudinary();
  const result = await cloudinary.uploader.upload(image, {
    folder: `shaadiscout/vendors/${req.user._id}`,
    resource_type: 'image',
    transformation: [{ width: 2000, height: 2000, crop: 'limit' }, { quality: 'auto', fetch_format: 'auto' }]
  });
  res.status(201).json({ url: result.secure_url, publicId: result.public_id });
};
