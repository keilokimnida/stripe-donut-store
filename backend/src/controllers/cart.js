const { findCartItemsByAccountID, insertCartItem, findCartItemByAccountIDAndProductID, updateCartItem, deleteCartItem, deleteAllCartItemByAccountID } = require('../services/cart');
const { findAccountByID } = require("../services/account");

// Get cart by account id
module.exports.findCartItemsByAccountID = async (req, res) => {
    try {
        const { decoded } = res.locals.auth;

        const accountID = parseInt(decoded.account_id);

        if (isNaN(accountID)) return res.status(400).json({
            message: "Invalid parameter \"accountID\""
        });

        const account = await findAccountByID(accountID); 
        if (!account) return res.status(404).json({
            message: `\"cart\" not found for ${accountID}`
        });

        const cart = await findCartItemsByAccountID(accountID);
        if (!cart) return res.status(404).json({
            message: `\"cart\" not found for ${accountID}`
        });

        return res.status(200).send({
            cart,
            account
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > cart.js! " + error);
    }
};

// Get cart by account id and product id
module.exports.findCartItemByAccountIDAndProductID = async (req, res) => {
    try {
        const { decoded } = res.locals.auth;
        const productID = parseInt(req.params.productID);

        const accountID = parseInt(decoded.account_id);

        if (isNaN(accountID)) return res.status(400).json({
            message: "Invalid parameter \"accountID\""
        });

        if (isNaN(productID)) return res.status(400).json({
            message: "Invalid parameter \"productID\""
        });

        const cartItem = await findCartItemByAccountIDAndProductID(accountID, productID);
        if (!cartItem) return res.status(204).json({
            message: `\"cartitem\" not found for ${accountID}`
        });

        return res.status(200).send(cartItem);

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > cart.js! " + error);
    }
}

// insert cart item
module.exports.insertCartItem = async (req, res) => {
    try {
        const { decoded } = res.locals.auth;

        const accountID = parseInt(decoded.account_id);
        const productID = parseInt(req.body.productID);
        const quantity = parseInt(req.body.quantity);

        if (isNaN(accountID)) return res.status(400).json({
            message: "Invalid parameter \"accountID\""
        });

        if (isNaN(productID)) return res.status(400).json({
            message: "Invalid parameter \"productID\""
        });

        if (isNaN(quantity)) return res.status(400).json({
            message: "Invalid parameter \"quantity\""
        });

        await insertCartItem(accountID, productID, quantity);
        return res.status(201).send("Cart item inserted successfully!");

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > cart.js! " + error);
    }
};

// update cart item
module.exports.updateCartItem = async (req, res) => {
    try {
        const { decoded } = res.locals.auth;

        const accountID = parseInt(decoded.account_id);
        const productID = parseInt(req.body.productID);
        const quantity = parseInt(req.body.quantity);

        if (isNaN(accountID)) return res.status(400).json({
            message: "Invalid parameter \"accountID\""
        });

        if (isNaN(productID)) return res.status(400).json({
            message: "Invalid parameter \"productID\""
        });

        if (isNaN(quantity)) return res.status(400).json({
            message: "Invalid parameter \"quantity\""
        });

        const toBeUpdated = await findCartItemByAccountIDAndProductID(accountID, productID);

        if (!toBeUpdated) return res.status(404).send();

        await updateCartItem(toBeUpdated, quantity);

        return res.status(204).send();

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > cart.js! " + error);
    }
};

// clear cart item
module.exports.deleteCartItem = async (req, res) => {
    try {
        const { decoded } = res.locals.auth;

        const accountID = parseInt(decoded.account_id);
        const productID = parseInt(req.params.productID);

        const toBeDeleted = await findCartItemByAccountIDAndProductID(accountID, productID);
        if (!toBeDeleted) return res.status(404).send();

        await deleteCartItem(accountID, productID);

        return res.status(204).send();

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > cart.js! " + error);
    }
};

// clear entire cart
module.exports.deleteAllCartItemByAccountID = async (req, res) => {
    try {
        const { decoded } = res.locals.auth;

        const accountID = parseInt(decoded.account_id);

        const cartExist = await findCartItemsByAccountID(accountID);

        if (!cartExist) return res.status(404).send();

        await deleteAllCartItemByAccountID(accountID);

        return res.status(204).send();

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > cart.js! " + error);
    }
};