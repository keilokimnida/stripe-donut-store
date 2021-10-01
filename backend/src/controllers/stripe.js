const { createPaymentIntent, createStripeCustomer, findStripeCustomerPaymentMethods, findPaymentIntent, updateSubscriptionPaymentMethod, updatePaymentIntent, findStripeCustomerPaymentMethod, createSetupIntent, findPaymentMethodByStripePaymentMethodID, detachPaymentMethod } = require('../services/stripe');
const { findAccountByID, updateAccountByID, findAccountByStripeCustID } = require('../models/account');
const { deleteAllCartItemByAccountID } = require('../models/cart');
const { insertOrder } = require('../models/orders');
const { insertPaymentMethod, updatePaymentMethod, findPaymentMethod, removePaymentMethod, findDuplicatePaymentMethod } = require('../models/paymentMethods');
const { findMembership } = require("../models/membership");

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

        if (!account) return res.status(400).json({
            message: "Cannot find \"account\""
        });

        let clientSecret;
        let paymentIntentID;

        // Check if user already has a payment intent
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

// Create setup intent
module.exports.createSetupIntent = async (req, res) => {
    try {
        const { decoded } = res.locals.auth;
        const accountID = parseInt(decoded.account_id);

        if (isNaN(accountID)) return res.status(400).json({
            message: "Invalid parameter \"accountID\""
        });

        const account = await findAccountByID(accountID);

        if (!account) return res.status(400).json({
            message: "Cannot find \"account\""
        });

        const setupIntent = await createSetupIntent(account.stripe_customer_id);
        const clientSecret = setupIntent.client_secret;
        const setupIntentID = setupIntent.id;

        return res.status(200).send({ clientSecret, setupIntentID });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > stripe.js! " + error);
    }
};

// Verify new stripePaymentMethod fingerprint doesn't already exist
module.exports.verifyPaymentMethodSetup = async (req, res) => {
    try {
        const { decoded } = res.locals.auth;
        const accountID = parseInt(decoded.account_id);
        const { stripePaymentMethodID } = req.body;

        if (isNaN(accountID)) return res.status(400).json({
            message: "Invalid parameter \"accountID\""
        });

        if (!stripePaymentMethodID) return res.status(400).json({
            message: "Invalid parameter \"stripePaymentMethodID\""
        });

        const account = await findAccountByID(accountID);

        if (!account) return res.status(400).json({
            message: "Cannot find \"account\""
        });

        const paymentMethod = await findPaymentMethodByStripePaymentMethodID(stripePaymentMethodID);

        if (!paymentMethod) return res.status(400).json({
            message: "Cannot find \"paymentMethod\""
        });

        const stripeFingerprint = paymentMethod.card.fingerprint;

        const duplicatedPaymentMethod = await findDuplicatePaymentMethod(accountID, stripeFingerprint, stripePaymentMethodID);

        let duplicate = false;
        if (duplicatedPaymentMethod) {
            duplicate = true;
            // dont need to detach locally and in stripe because it's handled in webhooks
        }

        return res.status(200).send({ duplicate });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > stripe.js! " + error);
    }
}

// Create Subscription
module.exports.createSubscription = async (req, res) => {
    try {

        const { decoded } = res.locals.auth;
        const accountID = parseInt(decoded.account_id);

        const { type } = req.params;

        if (!type) return res.status(400).json({
            message: "Invalid parameter \"type\""
        });

        if (isNaN(accountID)) return res.status(400).json({
            message: "Invalid parameter \"accountID\""
        });

        const account = await findAccountByID(accountID);

        if (!account) return res.status(400).json({
            message: "Cannot find \"account\""
        });

        const membership = await findMembership(type);
        const stripeSubscriptionPriceID = membership.stripe_price_id;

        let clientSecret;
        let subscriptionID;

        // Check if user already has a subscription id
        if (account.stripe_subscription_id === null) {
            const subscription = await createSubscription(account.stripe_customer_id, stripeSubscriptionPriceID);
            clientSecret = subscription.client_secret;
            subscriptionID = subscription.id;
            const updateAccountContent = {
                stripe_subscription_id: subscriptionID,
                stripe_subscription_client_secret: clientSecret
            };
            // Update account with the new subscription id and client secret
            await updateAccountByID(accountID, updateAccountContent);
        } else {
            clientSecret = account.stripe_subscription_client_secret;
            subscriptionID = account.stripe_subscription_id;
        }

        return res.status(200).send({ clientSecret, subscriptionID });

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
                const stripeCustomerID = paymentMethod.customer;
                // Find account id based on stripe customer id
                const account = await findAccountByStripeCustID(stripeCustomerID);
                const accountID = account.account_id;

                const duplicatedPaymentMethod = await findDuplicatePaymentMethod(accountID, stripeCardFingerprint, stripePaymentMethodID);

                let duplicate = false;
                if (duplicatedPaymentMethod) {
                    await detachPaymentMethod(stripePaymentMethodID);
                    duplicate = true;
                    // dont need to detach locally because it's handled in webhooks
                }

                const stripeCardLastFourDigit = paymentMethod.card.last4;
                const stripeCardType = paymentMethod.card.brand;
                const stripeCardExpMonth = paymentMethod.card.exp_month.toString();
                const stripeCardExpYear = paymentMethod.card.exp_year.toString();
                const stripeCardExpDate = stripeCardExpMonth + "/" + stripeCardExpYear.charAt(2) + stripeCardExpYear.charAt(3);

                const cardBGVariation = Math.floor((Math.random()) * 10) + 1;

                // Insert payment method
                await insertPaymentMethod(accountID, stripePaymentMethodID, stripeCardFingerprint, stripeCardLastFourDigit, stripeCardType, stripeCardExpDate, cardBGVariation);

                break;
            }
            // Stripe update payment method
            case 'payment_method.automatically_updated': {
                const paymentMethod = event.data.object;
                console.log(paymentMethod);

                const stripeCardFingerprint = paymentMethod.card.fingerprint;
                const stripeCardLastFourDigit = paymentMethod.card.last4;
                const stripeCardType = paymentMethod.card.brand;
                const stripeCardExpMonth = paymentMethod.card.exp_month.toString();
                const stripeCardExpYear = paymentMethod.card.exp_year.toString();
                const stripeCardExpDate = stripeCardExpMonth + "/" + stripeCardExpYear.charAt(2) + stripeCardExpYear.charAt(3);
                const stripePaymentMethodID = paymentMethod.id;
                const cardBGVariation = Math.floor(Math.random() + 1);

                // Update payment method
                await updatePaymentMethod(stripePaymentMethodID, stripeCardFingerprint, stripeCardLastFourDigit, stripeCardType, stripeCardExpDate, cardBGVariation);
                break;
            }
            // Customer remove payment method
            case 'payment_method.detached': {
                const paymentMethod = event.data.object;
                console.log(paymentMethod);
                // find payment intent id (local)
                const stripePaymentMethodID = paymentMethod.id;

                // Find local payment method id
                const foundPaymentMethod = await findPaymentMethod(stripePaymentMethodID);

                // Only remove payment method if payment method still exists in our mysql database as it might already have been deleted or doesn't even exist
                if (foundPaymentMethod) {
                    // remove payment method
                    await removePaymentMethod(foundPaymentMethod);
                }

                break;
            }
            // Customer update payment method
            case 'payment_method.updated': {
                const paymentMethod = event.data.object;
                console.log(paymentMethod);

                const stripeCardFingerprint = paymentMethod.card.fingerprint;
                const stripeCardLastFourDigit = paymentMethod.card.last4;
                const stripeCardType = paymentMethod.card.brand;
                const stripeCardExpMonth = paymentMethod.card.exp_month.toString();
                const stripeCardExpYear = paymentMethod.card.exp_year.toString();
                const stripeCardExpDate = stripeCardExpMonth + "/" + stripeCardExpYear.charAt(2) + stripeCardExpYear.charAt(3);
                const stripePaymentMethodID = paymentMethod.id;
                const cardBGVariation = Math.floor(Math.random() + 1);

                // Update payment method
                await updatePaymentMethod(stripePaymentMethodID, stripeCardFingerprint, stripeCardLastFourDigit, stripeCardType, stripeCardExpDate, cardBGVariation);
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
                // Remove customer payment intent
                await updateAccountByID(accountID, {
                    stripe_payment_intent_client_secret: null,
                    stripe_payment_intent_id: null
                });
                // Remove customer cart
                await deleteAllCartItemByAccountID(accountID);
                // Find payment method details
                const paymentMethod = await findStripeCustomerPaymentMethod(stripePaymentMethodID);
                const paymentType = paymentMethod.card.brand;
                const cardLastFourDigit = paymentMethod.card.last4;

                // Add to order table
                await insertOrder(accountID, paymentType, cardLastFourDigit, amount);
                break;
            }
            case 'invoice.payment_succeeded': {

                const invoice = event.data.object;
                if (invoice.billing_reason === 'subscription_create') {
                    const stripeSubscriptionID = invoice.subscription;
                    const stripePaymentIntentID = invoice.payment_intent;
                    const stripeCustomerID = invoice.customer;

                    // Retrieve payment intent used to pay the subscription
                    const stripePaymentIntent = await findPaymentIntent(stripePaymentIntentID);
                    const stripePaymentMethod = stripePaymentIntent.payment_method;

                    // set default payment method for subscription locally and on stripe
                    await updateSubscriptionPaymentMethod(stripeSubscriptionID, stripePaymentMethod.id); // update for stripe
                    
                    const account = findAccountByStripeCustID(stripeCustomerID);
                    const accountID = account.account_id;
                    const paymentMethod = await findPaymentMethod(paymentMethod.id);
                    
                    // for some reason if cannot find payment method in our database then dont save
                    if (paymentMethod) {
                        const paymentMethodID = paymentMethod.payment_methods_id;
                        await updateAccountByID(accountID, {
                            fk_subscription_default_payment_method: paymentMethodID
                        });
                    }
                }
            }
            case 'customer.subscription.updated': {
                // check what type of update to subscription
                // can be...
                // - created
                // - deleted
                // - change subscription status
            }
            case 'invoice.payment_action_required': {
                
            }
            case 'invoice.payment_failed': {

            }
            // Unexpected event type
            default:
                // should print errors into a log file
                console.log(`Unhandled event type ${event.type}.`);
        };

        return res.status(200).send();

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > stripe.js! " + error);
    }

}