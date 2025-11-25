const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

const allowedOrigins = [
  'http://localhost:3000',
  'https://vendor-verse-phi.vercel.app',
  'https://api-node-vendor-verse-backend.onrender.com'
];

// Enable CORS with specific options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('api-node-vendor-verse-backend.onrender.com')) {
      return callback(null, true);
    }
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use("/test", (req, res) => {
  res.send("Hello world!");
});
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// config
if (process.env.NODE_ENV?.toLocaleLowerCase() !== "production") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// import routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const coupon = require("./controller/coupounCode");
const payment = require("./controller/payment");
const order = require("./controller/order");
const conversation = require("./controller/conversation");
const message = require("./controller/message");
const withdraw = require("./controller/withdraw");

// Define route handlers for both prefixed and non-prefixed routes
const apiRoutes = [
  { path: '/user', handler: user },
  { path: '/conversation', handler: conversation },
  { path: '/message', handler: message },
  { path: '/order', handler: order },
  { path: '/shop', handler: shop },
  { path: '/product', handler: product },
  { path: '/event', handler: event },
  { path: '/coupon', handler: coupon },
  { path: '/payment', handler: payment },
  { path: '/withdraw', handler: withdraw },
];

// Register routes with both /api/v2 prefix and without it
apiRoutes.forEach(route => {
  app.use(`/api/v2${route.path}`, route.handler);
  app.use(route.path, route.handler);
});

// it's for ErrorHandling
app.use(ErrorHandler);

module.exports = app;
