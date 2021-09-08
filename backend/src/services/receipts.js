const { Receipts } = require("../models/Receipts");

// Insert cart item
module.exports.insertReceipt = (accountID, stripeReceiptUrl, stripePaymentMethodCard, stripePaymentMethodLastFourDigit, amount) => Receipts.create({
    stripe_receipt_url: stripeReceiptUrl,
    stripe_payment_method_card: stripePaymentMethodCard,
    stripe_payment_method_last_four_digit: stripePaymentMethodLastFourDigit,
    amount: amount,
    fk_account_id: accountID
});

// find receipt by account id
module.exports.findReceiptByAccountID = (accountID) => Receipts.findAll({
    where: {
        fk_account_id: accountID
    }
});