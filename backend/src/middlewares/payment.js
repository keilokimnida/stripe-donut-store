const { findCartItemsByAccountID } = require("../services/cart");

module.exports.calculateProductsTotalPrice = async (req, res, next) => {
    try {
        const { decoded } = res.locals.auth;

        const accountID = parseInt(decoded.account_id);

        if (isNaN(accountID)) return res.status(400).json({
            message: "Invalid parameter \"accountID\""
        });

        // Get all the items 
        const cart = await findCartItemsByAccountID(accountID);

        if (!cart || cart.length === 0) return res.status(400).json({ message: "No items in cart" });
        
        // Calculate products total price
        let totalPrice = 0;
        cart.forEach((cartObj, index) => {
            totalPrice += cartObj.quantity * parseFloat(cartObj.product.product_price);
        });

        res.locals.cartInfo = parseInt((totalPrice * 100).toFixed(2));
        return next();
    }
    catch (error) {
        console.log(error);
        return res.status(500).send();
    }
}