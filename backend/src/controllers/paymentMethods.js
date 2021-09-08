const { insertPaymentMethod, findPaymentMethodsByAccountID } = require("../services/paymentMethods");

// Insert payment method
// Only inserts to database, not stripe DB
module.exports.insertPaymentMethod = async (req, res) => {
    try {
        const { decoded } = res.locals.auth;

        const accountID = parseInt(decoded.account_id);
        if (isNaN(accountID)) return res.status(400).json({
            message: "Invalid parameter \"accountID\""
        });

        const { stripeCardFingerprint } = req.body;
        if (!stripeCardFingerprint) return res.status(404).json({
            message: `"Invalid parameter \"stripeCardFingerprint\""`
        });

        await insertPaymentMethod(accountID, stripeCardFingerprint);

        return res.status(200).send();

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > paymentMethods.js! " + error);
    }
};

module.exports.findPaymentMethodsByAccountID = async (req, res) => {
    try {
        const { decoded } = res.locals.auth;

        const accountID = parseInt(decoded.account_id);
        if (isNaN(accountID)) return res.status(400).json({
            message: "Invalid parameter \"accountID\""
        });

        const paymentMethods = await findPaymentMethodsByAccountID(accountID);

        return res.status(200).send({
            paymentMethods
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > paymentMethods.js! " + error);
    }
}