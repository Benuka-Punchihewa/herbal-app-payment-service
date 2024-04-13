const constants = require("../../constants");
const OrderService = require("../order/order.service");
const EmailService = require("../email/email.service");

const handlePaymentSuccessEvent = async (eventObj) => {
  const orderId = eventObj.metadata?.orderId;

  if (
    eventObj.payment_status !== constants.STRIPE_PAYMENT_STATUSES.PAID ||
    !orderId
  )
    return;

  try {
    const dbOrder = await OrderService.getById(orderId);
    if (!dbOrder) throw new NotFoundError("Order Not Found!");

    dbOrder.status = constants.ORDER.STATUSES.PAID;

    // update order details
    await OrderService.updateOrderStatus(
      orderId,
      constants.ORDER.STATUSES.PAID
    );

    // email customer
    const email = dbOrder?.user?.auth;
    if (email) {
      const reqBody = {
        toList: email,
        subject: "Payment Received",
        htmlBody: `<!DOCTYPE html>
          <html>
            <head>
              <title>Payment Received!</title>
              <style>
                body {
                  background-color: #f8f8f8;
                  font-family: Arial, sans-serif;
                  font-size: 16px;
                  line-height: 1.5;
                  color: #333;
                  padding: 0;
                  margin: 0;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #fff;
                  border-radius: 5px;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                  padding: 20px;
                  text-align: center;
                }
                h1 {
                  font-size: 24px;
                  margin-top: 0;
                  color: #333;
                }
                p {
                  margin-bottom: 20px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Payment Received!</h1>
                <p>Dear ${dbOrder?.user?.name},</p>
                <p>
                  We wanted to let you know that we have received your payment for order #
                  ${dbOrder?._id?.toString()}. Thank you for your business!
                </p>
                <p>
                  Your order will be processed and shipped shortly. You can expect to
                  receive your items within 2 - 5 working days.
                </p>

                <p>
                  If you have any questions or concerns, please don't hesitate to contact
                  us.
                </p>
                <p>Thank you,</p>
                <p>The Herbal App Team</p>
              </div>
            </body>
          </html>`,
      };
      await EmailService.sendEmail(reqBody);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { handlePaymentSuccessEvent };
