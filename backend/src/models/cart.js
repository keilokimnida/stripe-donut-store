const { CartItem } = require("../model_definitions/CartItem");
const { Account } = require("../model_definitions/Accounts");

// Get cart by account id
module.exports.findCartItemsByAccountID = (accountID) => CartItem.findAll({
    where: {
        fk_account_id: accountID
    },
    include: ["product"]
});

// Insert cart item
module.exports.insertCartItem = (accountID, productID, quantity) => CartItem.create({
    fk_account_id: accountID,
    fk_product_id: productID,
    quantity: quantity
});

// Get cart item by accountid and productid
module.exports.findCartItemByAccountIDAndProductID = (accountID, productID) => CartItem.findOne({
    where: {
        fk_account_id: accountID,
        fk_product_id: productID
    },
    include: ["account"]
});

// Update cart item
module.exports.updateCartItem = (toBeUpdated, quantity) => toBeUpdated.update({
    quantity
});

// Delete cart item
module.exports.deleteCartItem = (accountID, productID) => CartItem.destroy({
    where: {
        fk_account_id: accountID,
        fk_product_id: productID
    }
});

// Clear cart for accountid
module.exports.deleteAllCartItemByAccountID = (accountID) => CartItem.destroy({
    where: {
        fk_account_id: accountID
    }
});