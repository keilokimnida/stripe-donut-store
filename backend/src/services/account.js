const { Accounts } = require("../models/Accounts");
const { PaymentMethods } = require("../models/PaymentMethods");
const { Receipts } = require("../models/Receipts");

module.exports.findAccountByID = (accountID) => Accounts.findByPk(accountID, {
    include: [{
        model: PaymentMethods,
        as: "payment_accounts"
    }, {
        model: Receipts,
        as: "receipt" //Error: Receipt not showing
    }] 
});

module.exports.updateAccountByID = (accountID, content) => Accounts.update({
    ...content
}, {
    where: {
        account_id: accountID
    }
})