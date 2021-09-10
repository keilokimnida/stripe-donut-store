const { createPaymentIntent, createStripeCustomer, findStripeCustomerPaymentMethods, updatePaymentIntent } = require('../services/stripe');
const { findAccountByID, updateAccountByID } = require('../models/account');

// Create payment intent
module.exports.createPaymentIntent = async (req, res) => {
    try {

        const { decoded } = res.locals.auth;
        const accountID = parseInt(decoded.account_id);

        if (isNaN(accountID)) return res.status(400).json({
            message: "Invalid parameter \"accountID\""
        });

        const totalPrice = res.locals.cartInfo;
        const account = await findAccountByID(accountID);

        // Check if user already has a payment intent
        if (!account) return res.status(400).json({
            message: "Cannot find \"account\""
        });

        let clientSecret;

        if (account.stripe_payment_intent_id === null) {
            const paymentIntent = await createPaymentIntent(totalPrice, account.stripe_customer_id);
            clientSecret = paymentIntent.client_secret;
            const paymentIntentID = paymentIntent.id;
            const updateAccountContent = {
                stripe_payment_intent_id: paymentIntentID,
                stripe_payment_intent_client_secret: clientSecret
            };
            // Update account with the new payment intent and client secret
            await updateAccountByID(accountID, updateAccountContent);
        } else {
            clientSecret = account.stripe_payment_intent_client_secret;
        }

        return res.status(200).send({clientSecret});

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > stripe.js! " + error);
    }
};

// Create stripe customer
module.exports.createStripeCustomer = async (req, res) => {
    try {

        const { email, firstName, lastName } = req.body;
        const fullName = lastName + " " + firstName;
        const customer = await createStripeCustomer(email, fullName);

        return res.status(200).send(customer);

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > stripe.js! " + error);
    }
};

// Get stripe customer payment methods
module.exports.findStripeCustomerPaymentMethods = async (req, res) => {
    try {

        const { stripeCustomerID } = req.params;
        const customer = await findStripeCustomerPaymentMethods(stripeCustomerID);

        return res.status(200).send(customer);

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > stripe.js! " + error);
    }
};

// Update payment intent
module.exports.updatePaymentIntent = async (req, res) => {
    try {
        const { paymentIntentID } = req.body;
        if (!paymentIntentID) return res.status(400).json({
            message: "Cannot find parameter \"paymentIntentID\""
        });
        const totalPrice = res.locals.cartInfo;

        await updatePaymentIntent(paymentIntentID, totalPrice);

        return res.status(204).send();

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > stripe.js! " + error);
    }
};

