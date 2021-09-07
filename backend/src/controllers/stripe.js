const { createPaymentIntent } = require('../services/stripe');

// Get cart by account id
module.exports.createPaymentIntent = async (req, res) => {
    try {

        const { products } = req.body;
        const paymentIntent = await createPaymentIntent(products);

        return res.status(200).send({
            clientSecret: paymentIntent.client_secret
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > stripe.js! " + error);
    }
};
