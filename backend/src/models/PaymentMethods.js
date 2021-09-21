const { PaymentMethods } = require("../model_definitions/PaymentMethods");
const { Accounts_PaymentMethods } = require("../model_definitions/Accounts_PaymentMethods");
const { Accounts } = require("../model_definitions/Accounts");
const { Op } = require("sequelize");

module.exports.insertPaymentMethod = async (accountID, stripePaymentMethodID, stripeCardFingerprint, stripeCardLastFourDigit, stripeCardType, stripeCardExpDate, cardBGVariation) => {

    const paymentMethods = await PaymentMethods.create({
        stripe_payment_method_id: stripePaymentMethodID,
        stripe_payment_method_fingerprint: stripeCardFingerprint,
        stripe_card_last_four_digit: stripeCardLastFourDigit,
        stripe_card_type: stripeCardType,
        stripe_card_exp_date: stripeCardExpDate,
        card_bg_variation: cardBGVariation
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
    },
    order: [['accounts_payment_methods_id', 'ASC']]
});

module.exports.findPaymentMethod = (stripePaymentMethodID) => PaymentMethods.findOne({
    where: {
        stripe_payment_method_id: stripePaymentMethodID
    },
    include: {
        model: Accounts,
        as: "payment_methods"
    },
    order: [['payment_methods_id', 'ASC']]
});

module.exports.findPaymentMethodByAccountIDAndPaymentMethodID = (paymentMethodID, accountID) => Accounts_PaymentMethods.findOne({
    where: {
        fk_payment_methods_id: paymentMethodID,
        fk_account_id: accountID
    },
    order: [['accounts_payment_methods_id', 'ASC']]
});

module.exports.updatePaymentMethod = (stripePaymentMethodID, stripeCardFingerprint, stripeCardLastFourDigit, stripeCardType, stripeCardExpDate, cardBGVariation) => PaymentMethods.update({
    stripe_payment_method_fingerprint: stripeCardFingerprint,
    stripe_last_four_digit: stripeCardLastFourDigit,
    stripe_card_type: stripeCardType,
    stripe_card_exp_date: stripeCardExpDate,
    card_bg_variation: cardBGVariation
}, {
    where: {
        stripe_payment_method_id: stripePaymentMethodID
    }
});

module.exports.removePaymentMethod = (paymentMethod) => paymentMethod.destroy();

module.exports.findDuplicatePaymentMethod = (accountID, stripeFingerprint, stripePaymentMethodID) => Accounts.findOne({
    where: {
        account_id: accountID
    },
    include: {
        model: PaymentMethods,
        as: "payment_accounts",
        where: {
            stripe_payment_method_fingerprint: stripeFingerprint,
            stripe_payment_method_id: {
                [Op.ne]: stripePaymentMethodID
            }
        }
    }
});