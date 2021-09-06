// Get cart by account id
module.exports.createPaymentIntent = async (req, res) => {
    try {

        const { items } = req.body;
        const paymentIntent = await createPaymentIntent(items);

        return res.status(200).send({
            clientSecret: paymentIntent.client_secret
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > stripe.js! " + error);
    }
};
