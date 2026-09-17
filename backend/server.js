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

dotenv.config({ path: path.join(__dirname, 'config', '.env') });

const trimmedEnv = (value) => (typeof value === 'string' ? value.trim() : value);

cloudinary.config({
    cloud_name: trimmedEnv(process.env.CLOUDINARY_CLOUD_NAME),
    api_key: trimmedEnv(process.env.CLOUDINARY_API_KEY),
    api_secret: trimmedEnv(process.env.CLOUDINARY_API_SECRET)
});

function listenOnPort(portToUse) {
    return new Promise((resolve, reject) => {
        const server = app.listen(portToUse, () => {
            console.log(`Server is listening on port ${portToUse}...`);
            resolve(server);
        });

        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                const nextPort = portToUse + 1;
                console.warn(`Port ${portToUse} is busy. Retrying on port ${nextPort}...`);
                listenOnPort(nextPort).then(resolve).catch(reject);
                return;
            }

            reject(error);
        });
    });
}

async function startServer() {
    await connectDB();
    const preferredPort = Number(process.env.PORT) || 5000;
    await listenOnPort(preferredPort);
}

startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});