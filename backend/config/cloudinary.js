const path = require('path');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary');

dotenv.config({ path: path.join(__dirname, '.env') });

const trimValue = (value) => (typeof value === 'string' ? value.trim() : value);

cloudinary.v2.config({
  cloud_name: trimValue(process.env.CLOUDINARY_CLOUD_NAME),
  api_key: trimValue(process.env.CLOUDINARY_API_KEY),
  api_secret: trimValue(process.env.CLOUDINARY_API_SECRET),
  secure: true,
});

module.exports = cloudinary;
