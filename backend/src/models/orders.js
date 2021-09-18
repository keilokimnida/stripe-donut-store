const { Orders } = require("../model_definitions/Orders");

// Insert order
module.exports.insertOrder = (accountID, stripePaymentMethodType, stripePaymentMethodLastFourDigit, amount) => Orders.create({
    stripe_payment_method_type: stripePaymentMethodType,
    stripe_payment_method_last_four_digit: stripePaymentMethodLastFourDigit,
    amount: amount,
    fk_account_id: accountID
});

// find order by accountid
module.exports.findOrderByAccountID = (accountID) => Orders.findAll({
    where: {
        fk_account_id: accountID
    }
});