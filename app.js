const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(
  cors({
    origin: ["https://vendor-verse-phi.vercel.app/"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/test", (req, res) => {
  res.send("Hello world!");
});
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
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

app.use("/user", user);
app.use("/conversation", conversation);
app.use("/message", message);
app.use("/order", order);
app.use("/shop", shop);
app.use("/product", product);
app.use("/event", event);
app.use("/coupon", coupon);
app.use("/payment", payment);
app.use("/withdraw", withdraw);

// it's for ErrorHandling
app.use(ErrorHandler);

module.exports = app;
