// import libraries
const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("express-async-errors");

// import middleware
const errorHandlerMiddleware = require("./modules/error/error.middleware");

// import errors
const NotFoundError = require("./modules/error/error.classes/NotFoundError");

// import configs
const constants = require("./constants");

// import routes
const PaymentRoutes = require("./modules/payment/payment.route");

const app = express();

app.use(cors());

// Use parsers only for non-webhook routes
app.use((req, res, next) => {
  if (
    req.originalUrl === constants.API.PREFIX.concat("/payments/stripe-webhook")
  ) {
    next();
  } else {
    express.json()(req, res, next);
    app.use(express.urlencoded({ extended: true }));
  }
});

// define routes
app.use(constants.API.PREFIX.concat("/payments"), PaymentRoutes);

// not found route
app.use((req, res, next) => {
  throw new NotFoundError("API Endpoint Not Found!");
});

// error handler middleware
app.use(errorHandlerMiddleware);

/**
 * connect to database and run application on defined port
 */
const start = async () => {
  const port = process.env.PORT || constants.PORT;
  try {
    app.listen(port, () => {
      console.log(`SERVER IS LISTENING ON PORT ${port}...`);
    });
  } catch (err) {
    console.error(err);
  }
};

start();
