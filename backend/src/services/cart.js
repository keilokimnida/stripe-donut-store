const { CartItem } = require("../models/CartItem");

module.exports.findCartItemsByAccountID = (accountID) => CartItem.findAll({
    where: {
        fk_account_id: accountID
    }
});