const { findCartItemsByAccountID } = require('../services/cart');

// Get cart by account id
module.exports.findCartItemsByAccountID = async (req, res) => {
    try {
        const accountID = parseInt(req.params.accountID);

        if (isNaN(accountID)) return res.status(400).json({
            message: "Invalid parameter \"accountID\""
        });

        const cart = await findCartItemsByAccountID(accountID);
        if (!cart) return res.status(404).json({
            message: `\"cart\" not found for ${accountID}`
        });

        return res.status(200).send(cart);

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > cart.js! " + error);
    }
};

// insert cart item
module.exports.insertCartItem = async (req, res) => {
    try {
        const accountID = parseInt(req.body.accountID);
        const productID = parseInt(req.body.productID);

        if (isNaN(accountID)) return res.status(400).json({
            message: "Invalid parameter \"accountID\""
        });

        if (isNaN(productID)) return res.status(400).json({
            message: "Invalid parameter \"productID\""
        });

        await insertCartItem(accountID, productID);
        return res.status(201).send("Cart item inserted successfully!");

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > cart.js! " + error);
    }
};

// update cart item
module.exports.updateCartItem = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > cart.js! " + error);
    }
};

// clear cart item
module.exports.deleteAllCartItemByProductID = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > cart.js! " + error);
    }
};

// clear entire cart
module.exports.deleteAllCartItemByProductID = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > cart.js! " + error);
    }
};