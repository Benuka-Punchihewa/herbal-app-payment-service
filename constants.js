const constants = {
  PORT: 5001,
  API: {
    PREFIX: "/api/v1",
  },
  ACCESS: {
    ROLES: {
      ADMIN: "admin",
      SELLER: "seller",
      CUSTOMER: "customer",
      SERVICE: "service",
    },
  },
  PAYMENT_CURRENCY: "LKR",
  STRIPE_PAYMENT_STATUSES: {
    PAID: "paid",
  },
  ORDER: {
    STATUSES: {
      PENDING: "pending",
      PAID: "paid",
      CONFIRMED: "confirmed",
      DISPATCHED: "dispatched",
      DELEVERED: "delivered",
    },
  },
};

module.exports = constants;
