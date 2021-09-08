const config = require("../config/config");
const { PaymentMethods } = require("../models/PaymentMethods");
const { Accounts_PaymentMethods } = require("../models/Accounts_PaymentMethods");

// Test secret API Key
const stripe = require("stripe")(config.stripe.test.sk);

// Create payment intent
module.exports.createPaymentIntent = (totalPrice) => stripe.paymentIntents.create({
    amount: totalPrice,
    currency: "sgd",
    receipt_email: "tkl48leon@gmail.com"
});

// Create customer
module.exports.createStripeCustomer = (email, name) => stripe.customers.create({
    email,
    name
});

module.exports.findStripeCustomerPaymentMethods = (stripeCustomerID) => stripe.paymentMethods.list({
  customer: stripeCustomerID,
  type: 'card'
});

module.exports.updatePaymentIntent = (paymentIntentID, totalPrice) => stripe.paymentIntents.update(
  paymentIntentID, {
    amount: totalPrice,
    currency: "sgd"
});

module.exports.cancelPaymentIntent = (paymentIntentID) => stripe.paymentIntents.cancel(paymentIntentID);