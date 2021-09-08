const { insertReceipt } = require('../services/receipts');

// Get account by ID

module.exports.insertReceipt = async (req, res) => {
    try {

        const { decoded } = res.locals.auth;
        const totalPrice = res.locals.cartInfo;

        const accountID = parseInt(decoded.account_id);

        
        if (isNaN(accountID)) return res.status(400).json({
            message: "Invalid parameter \"accountID\""
        });

        const {stripeReceiptUrl, stripePaymentMethodCard, stripePaymentMethodLastFourDigit} = req.body;

        if (!(stripeReceiptUrl && stripePaymentMethodCard && stripePaymentMethodLastFourDigit)) {
            return res.status(400).json({
                message: "Invalid parameter!"
            });
        }

        await insertReceipt(accountID, stripeReceiptUrl, stripePaymentMethodCard, stripePaymentMethodLastFourDigit, totalPrice);
        if (!account) return res.status(404).json({
            message: `\"accountID\" ${accountID} not found`
        });

        return res.status(200).send();

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > account.js! " + error);
    }
}