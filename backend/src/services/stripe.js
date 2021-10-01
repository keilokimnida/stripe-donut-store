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

// Find payment intent
module.exports.findPaymentIntent = (paymentIntentID) => stripe.paymentIntent.retrieve(paymentIntentID, {
  expand: ['payment_method']
});

// Update payment intent
module.exports.updatePaymentIntent = (paymentIntentID, totalPrice) => stripe.paymentIntents.update(
  paymentIntentID, {
  amount: totalPrice,
  currency: "sgd"
});

// Create setup intent
module.exports.createSetupIntent = (stripeCustomerID) => stripe.setupIntents.create({
  customer: stripeCustomerID,
});

// find payment method by payment method id
module.exports.findPaymentMethodByStripePaymentMethodID = (stripePaymentMethodID) => stripe.paymentMethods.retrieve(
  stripePaymentMethodID
);

// Cancel payment intent
module.exports.cancelPaymentIntent = (paymentIntentID) => stripe.paymentIntents.cancel(paymentIntentID);

// Detach payment method
module.exports.detachPaymentMethod = (stripePaymentMethodID) => stripe.paymentMethods.detach(
  stripePaymentMethodID
);

// Create payment intent
module.exports.createSubscription = (stripeCustomerID, stripeSubscriptionPriceID) => stripe.paymentIntents.create({
  customer: stripeCustomerID || null,
  items: [{
    price: stripeSubscriptionPriceID
  }],
  payment_behavior: 'default_incomplete',
  expand: ['latest_invoice.payment_intent'],
  receipt_email: "tkl48leon@gmail.com"
});

// Update defauly payment method for subscription
module.exports.updateSubscriptionPaymentMethod = (subscriptionID, paymentMethod) => stripe.subscriptions.update(
  subscriptionID,
  {
    default_payment_method: paymentMethod,
  },
);
