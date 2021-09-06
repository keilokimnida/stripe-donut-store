const config = require("./src/config/config");

// Test secret API Key
const stripe = require("stripe")(config.stripe.test);

const calculateOrderAmount = items => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 1400;
  };

// Get cart by account id
module.exports.findCartItemsByAccountID = (items) => stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "sgd"
});