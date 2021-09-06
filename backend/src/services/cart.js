const { CartItem } = require("../models/CartItem");

// Get cart by account id
module.exports.findCartItemsByAccountID = (accountID) => CartItem.findAll({
    where: {
        fk_account_id: accountID
    }
});

// Insert
module.exports.insertCartItem = (accountID, productID) => CartItem.create({
    where: {
        fk_account_id: accountID
    }
});