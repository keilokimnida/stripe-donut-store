const { PaymentMethods } = require("../models/PaymentMethods");
const { Accounts_PaymentMethods } = require("../models/Accounts_PaymentMethods");

module.exports.insertPaymentMethod = (accountID, stripeCardFingerprint, stripeCardLastFourDigit, stripeCardType) => {

    const paymentMethods = await PaymentMethods.create({
        stripe_paymemt_method_fingerprint: stripeCardFingerprint,
        stripe_last_four_digit:  stripeCardLastFourDigit,
        stripe_card_type: stripeCardType
    });

    try {
        await Accounts_PaymentMethods.create({
           fk_account_id: accountID,
           fk_payment_methods_id: paymentMethods.payment_methods_id
        });
    } catch (e) {
        console.log(e);
        PaymentMethods.destroy({
            where: {
                fk_account_id: accountID
            }
        });
        throw error;
    }
};

module.exports.findPaymentMethodsByAccountID = (accountID) => Accounts_PaymentMethods.findAll({
    where: {
        fk_account_id: accountID
    }
});