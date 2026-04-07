const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");





// Enable CORS for common local frontend origins (localhost, 127.0.0.1, LAN IPs).
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow non-browser clients and server-to-server calls.
            if (!origin) return callback(null, true);

            const isLocalhost =
                /^http:\/\/localhost:\d{2,5}$/.test(origin) ||
                /^http:\/\/127\.0\.0\.1:\d{2,5}$/.test(origin);

            const isLan3000 =
                /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:3000$/.test(origin) ||
                /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}:3000$/.test(origin) ||
                /^http:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}:3000$/.test(origin);

            if (allowedOrigins.includes(origin) || isLocalhost || isLan3000) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);


app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());


const product = require('../backend/routes/productRoute');
const user = require('../backend/routes/userRoute');
const order = require('../backend/routes/orderRoute');
const payment = require('../backend/routes/paymentRoute')

app.use('/api/v1',product);
app.use('/api/v1',user);
app.use('/api/v1',order);
app.use('/api/v1',payment);





module.exports = app;