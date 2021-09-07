const config = require("../config/config");

// Test secret API Key
const stripe = require("stripe")(config.stripe.test);

const calculateOrderAmount = (products) => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 1400;
  };

// Get cart by account id
// module.exports.createPaymentIntent = (products) => stripe.paymentIntents.create({
//     amount: calculateOrderAmount(products),
//     currency: "sgd"
// });