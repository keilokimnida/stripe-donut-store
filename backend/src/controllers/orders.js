const { insertOrder } = require('../models/orders');

// Insert order

module.exports.insertOrder = async (req, res) => {
    try {

        const { decoded } = res.locals.auth;
        const totalPrice = res.locals.cartInfo;

        const accountID = parseInt(decoded.account_id);
        
        if (isNaN(accountID)) return res.status(400).json({
            message: "Invalid parameter \"accountID\""
        });

        const {stripeReceiptUrl, stripePaymentMethodType, stripePaymentMethodLastFourDigit} = req.body;

        if (!(stripeReceiptUrl && stripePaymentMethodCard && stripePaymentMethodLastFourDigit)) {
            return res.status(400).json({
                message: "Invalid parameter!"
            });
        }

        await insertOrder(accountID, stripeReceiptUrl, stripePaymentMethodType, stripePaymentMethodLastFourDigit, totalPrice);

        return res.status(200).send();

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > orders.js! " + error);
    }
}