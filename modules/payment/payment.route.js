const express = require("express");
const PaymentController = require("./payment.controller");
const AuthMiddleware = require("../auth/auth.middleware");
const constants = require("../../constants");

const router = express.Router();

// create checkout session
router.post(
  "/orders/:orderId",
  AuthMiddleware.authorize([constants.ACCESS.ROLES.CUSTOMER]),
  PaymentController.createCheckoutSession
);

// create checkout session
router.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  PaymentController.handleWebhookEvents
);

module.exports = router;
