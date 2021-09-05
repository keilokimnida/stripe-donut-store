const { Accounts } = require("../models/Accounts");

module.exports.findAccountByID = (accountID) => Accounts.findOne({
    where: {
        account_id: accountID
    }
});