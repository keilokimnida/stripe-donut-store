const { Accounts } = require("../models/Accounts");

module.exports.findAccountByID = (accountID) => Accounts.findOne({
    where: {
        account_id: accountID
    }
});

module.exports.updateAccountByID = (accountID, content) => Accounts.update({
    ...content
}, {
    where: {
        account_id: accountID
    }
})