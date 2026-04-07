// const app = require('./app');
// const dotenv = require('dotenv');
// const path = require('path');
// const connectDB = require('./config/db');
// const cloudinary = require('cloudinary');

// dotenv.config({ path: path.join(__dirname, 'config', '.env') });

// const trimmedEnv = (value) => (typeof value === 'string' ? value.trim() : value);

// cloudinary.config({
//     cloud_name: trimmedEnv(process.env.CLOUDINARY_CLOUD_NAME),
//     api_key: trimmedEnv(process.env.CLOUDINARY_API_KEY),
//     api_secret: trimmedEnv(process.env.CLOUDINARY_API_SECRET)
// });

// async function startServer() {
//     await connectDB();

//     app.listen(process.env.PORT, () => {
//         console.log(`Server is listening on port ${process.env.PORT}...`);
//     });
// }

// startServer().catch((error) => {
//     console.error('Failed to start server:', error);
//     process.exit(1);
// });

















const app = require('./app');
const dotenv = require("dotenv");
const path = require('path');
const connectDB = require('./config/db');
const cloudinary = require('cloudinary');

// ✅ correct dotenv config
dotenv.config({ path: path.join(__dirname, 'config', '.env') });

const trimmedEnv = (value) => (typeof value === 'string' ? value.trim() : value);

cloudinary.config({
    cloud_name: trimmedEnv(process.env.CLOUDINARY_CLOUD_NAME),
    api_key: trimmedEnv(process.env.CLOUDINARY_API_KEY),
    api_secret: trimmedEnv(process.env.CLOUDINARY_API_SECRET)
});

async function startServer() {
    await connectDB();

    app.listen(process.env.PORT, () => {
        console.log(`Server is listening on port ${process.env.PORT}...`);
    });
}

startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});