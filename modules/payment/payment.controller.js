const NotFoundError = require("../error/error.classes/NotFoundError");
const ForbiddenError = require("../error/error.classes/ForbiddenError");
const BadRequestError = require("../error/error.classes/BadRequestError");
const { StatusCodes } = require("http-status-codes");
const Constants = require("../../constants");
const OrderService = require("../order/order.service");
const PaymentUtil = require("./payment.util");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  const { orderId } = req.params;
  const auth = req.auth;

  // validate order
  const dbOrder = await OrderService.getById(orderId);
  if (!dbOrder) throw new NotFoundError("Order not found!");

  // validate ownership
  if (dbOrder.user._id.toString() !== auth.user._id.toString())
    throw new ForbiddenError("You're Unauthorized to Access This Resource!");

  // validate order status
  if (dbOrder.status !== Constants.ORDER.STATUSES.PENDING)
    throw new BadRequestError("Payment Has Already Been Done!");

  // prepare line items
  const lineItems = [];
  for (const item of dbOrder.items) {
    lineItems.push({
      price_data: {
        currency: Constants.PAYMENT_CURRENCY,
        unit_amount: Math.trunc((item.total / item.quantity) * 100), // in cents
        product_data: {
          name: item.product.name,
        },
      },
      quantity: Math.trunc(item.quantity),
    });
  }

  // add service charge
  lineItems.push({
    price_data: {
      currency: Constants.PAYMENT_CURRENCY,
      unit_amount: Math.trunc(dbOrder.serviceCharge * 100), // in cents
      product_data: {
        name: "Service Charge",
      },
    },
    quantity: 1,
  });

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: Math.trunc(dbOrder.shippingCharge) * 100,
            currency: Constants.PAYMENT_CURRENCY,
          },
          display_name: "Standard Delivery",
          // Delivers between 2-5 business days
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 2,
            },
            maximum: {
              unit: "business_day",
              value: 5,
            },
          },
        },
      },
    ],
    currency: Constants.PAYMENT_CURRENCY,
    metadata: {
      orderId: dbOrder._id.toString(),
    },
    mode: "payment",
    success_url: `${process.env.FRONTEND_BASE_URL}/orders/${dbOrder._id}`,
    cancel_url: `${process.env.FRONTEND_BASE_URL}/my-orders?canceled=true&orderId=${dbOrder._id}`,
  });

  return res.status(StatusCodes.OK).json({
    message: "Go To The Provided URL To Complete The Payment ",
    url: session.url,
  });
};

const handleWebhookEvents = async (req, res) => {
  console.log("Stripe webhook called");

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const eventObj = event.data.object;
      PaymentUtil.handlePaymentSuccessEvent(eventObj);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};

module.exports = { createCheckoutSession, handleWebhookEvents };
