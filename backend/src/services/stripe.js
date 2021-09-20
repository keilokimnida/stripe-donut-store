const config = require("../config/config");

// Test secret API Key
const stripe = require("stripe")(config.stripe.test.secretKey);

// Create payment intent
module.exports.createPaymentIntent = (totalPrice, stripeCustomerID) => stripe.paymentIntents.create({
    amount: totalPrice,
    currency: "sgd",
    customer: stripeCustomerID || null,
    receipt_email: "tkl48leon@gmail.com"
});

// Confirm payment intent
module.exports.confirmPaymentIntent = (stripePaymentMethodID, stripePaymentIntentID) => stripe.paymentIntents.confirm(
  stripePaymentIntentID,
  {payment_method: stripePaymentMethodID}
);

// Create customer
module.exports.createStripeCustomer = (email, name) => stripe.customers.create({
    email,
    name
});

// Get payment methods by ID
module.exports.findStripeCustomerPaymentMethods = (stripeCustomerID) => stripe.paymentMethods.list({
  customer: stripeCustomerID,
  type: 'card'
});

// Get payment method by stripe payment method id
module.exports.findStripeCustomerPaymentMethod = (stripePaymentMethodID) => stripe.paymentMethods.retrieve(
  stripePaymentMethodID
);


// Update payment intent
module.exports.updatePaymentIntent = (paymentIntentID, totalPrice) => stripe.paymentIntents.update(
  paymentIntentID, {
    amount: totalPrice,
    currency: "sgd"
});

// Cancel payment intent
module.exports.cancelPaymentIntent = (paymentIntentID) => stripe.paymentIntents.cancel(paymentIntentID);