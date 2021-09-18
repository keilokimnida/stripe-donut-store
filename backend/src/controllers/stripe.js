const { createPaymentIntent, createStripeCustomer, findStripeCustomerPaymentMethods, updatePaymentIntent, findStripeCustomerPaymentMethod } = require('../services/stripe');
const { findAccountByID, updateAccountByID, findAccountByStripeCustID } = require('../models/account');
const { deleteAllCartItemByAccountID } = require('../models/cart');
const { insertOrder } = require('../models/orders');
const { insertPaymentMethod, updatePaymentMethod, findPaymentMethodID, removePaymentMethod, findPaymentMethodByAccountIDAndPaymentMethodID } = require('../models/paymentMethods');

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
        let paymentIntentID;

        if (account.stripe_payment_intent_id === null) {
            const paymentIntent = await createPaymentIntent(totalPrice, account.stripe_customer_id);
            clientSecret = paymentIntent.client_secret;
            paymentIntentID = paymentIntent.id;
            const updateAccountContent = {
                stripe_payment_intent_id: paymentIntentID,
                stripe_payment_intent_client_secret: clientSecret
            };
            // Update account with the new payment intent and client secret
            await updateAccountByID(accountID, updateAccountContent);
        } else {
            clientSecret = account.stripe_payment_intent_client_secret;
            paymentIntentID = account.stripe_payment_intent_id;
        }

        return res.status(200).send({ clientSecret, paymentIntentID });

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

// Handle webhook
module.exports.handleWebhook = async (req, res) => {
    try {
        const event = req.body;

        // Handle the event
        switch (event.type) {
            // Customer add payment method
            case 'payment_method.attached': {
                const paymentMethod = event.data.object;
                console.log(paymentMethod);

                const stripePaymentMethodID = paymentMethod.id;
                const stripeCardFingerprint = paymentMethod.card.fingerprint;
                const stripeCardLastFourDigit = paymentMethod.card.last4;
                const stripeCardType = paymentMethod.card.brand;
                const stripeCustomerID = paymentMethod.customer;

                // Find account id based on stripe customer id
                const account = await findAccountByStripeCustID(stripeCustomerID);
                const accountID = account.account_id;

                // Insert payment method
                await insertPaymentMethod(accountID, stripePaymentMethodID, stripeCardFingerprint, stripeCardLastFourDigit, stripeCardType);

                break;
            }
            // Stripe update payment method
            case 'payment_method.automatically_updated': {
                const paymentMethod = event.data.object;
                console.log(paymentMethod);

                const stripeCardFingerprint = paymentMethod.card.fingerprint;
                const stripeCardLastFourDigit = paymentMethod.card.last4;
                const stripeCardType = paymentMethod.card.brand;
                const stripePaymentMethodID = paymentMethod.id;

                // Update payment method
                await updatePaymentMethod(stripePaymentMethodID, stripeCardFingerprint, stripeCardLastFourDigit, stripeCardType);
                break;
            }
            // Customer remove payment method
            case 'payment_method.detached': {
                const paymentMethod = event.data.object;
                console.log(paymentMethod);
                // find payment intent id (local)
                const stripePaymentMethodID = paymentMethod.id;
                const stripeCustomerID = paymentMethod.customer;

                // Find account id based on stripe customer id
                const account = await findAccountByStripeCustID(stripeCustomerID);
                const accountID = account.account_id;

                // Find local payment method id
                const paymentMethodID = await findPaymentMethodID(stripePaymentMethodID);

                // Find payment method method based on account id and local payment method id
                const foundPaymentMethod = await findPaymentMethodByAccountIDAndPaymentMethodID(paymentMethodID, accountID);

                // remove payment method
                await removePaymentMethod(foundPaymentMethod);

                break;
            }
            // Customer update payment method
            case 'payment_method.updated': {
                const paymentMethod = event.data.object;
                console.log(paymentMethod);

                const stripeCardFingerprint = paymentMethod.card.fingerprint;
                const stripeCardLastFourDigit = paymentMethod.card.last4;
                const stripeCardType = paymentMethod.card.brand;
                const stripePaymentMethodID = paymentMethod.id;

                // Update payment method
                await updatePaymentMethod(stripePaymentMethodID, stripeCardFingerprint, stripeCardLastFourDigit, stripeCardType);
                break;
            }
            // Payment intent success
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;

                // Find out account id from stripe customer id
                const stripeCustomerID = paymentIntent.customer;
                const stripePaymentMethodID = paymentIntent.payment_method;
                const amount = paymentIntent.amount / 100;

                const account = await findAccountByStripeCustID(stripeCustomerID);
                const accountID = account.account_id;
                console.log(1);
                // Remove customer payment intent
                await updateAccountByID(accountID, {
                    stripe_payment_intent_client_secret: null,
                    stripe_payment_intent_id: null
                });
                console.log(2);
                // Remove customer cart
                await deleteAllCartItemByAccountID(accountID);
                console.log(3);
                // Find payment method details
                const paymentMethod = await findStripeCustomerPaymentMethod(stripePaymentMethodID); 
                const paymentType = paymentMethod.card.brand;
                const cardLastFourDigit = paymentMethod.card.last4;
         
                // Add to order table
                await insertOrder(accountID, paymentType, cardLastFourDigit, amount);
                console.log(4);
                break;
            }
            // Unexpected event type
            default:
                console.log(`Unhandled event type ${event.type}.`);
        };

        return res.status(200).send();

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > stripe.js! " + error);
    }

}