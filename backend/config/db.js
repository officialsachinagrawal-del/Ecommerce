const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer;

async function connectWithMemoryServer() {
    memoryServer = await MongoMemoryServer.create();
    const memoryUri = memoryServer.getUri('smartshop');
    await mongoose.connect(memoryUri);
    console.log('Using in-memory MongoDB fallback');
}

async function connectDB() {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL;

    try {
        if (!mongoUri) {
            await connectWithMemoryServer();
            return;
        }

        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully');

    } catch (err) {
        console.log('MongoDB connection failed, switching to in-memory fallback');
        console.log(err.message);

        try {
            await connectWithMemoryServer();
        } catch (fallbackErr) {
            console.log(fallbackErr.message);
            process.exit(1);
        }
    }
}

module.exports = connectDB;