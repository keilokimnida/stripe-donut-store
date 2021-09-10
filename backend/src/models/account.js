const { Accounts } = require("../model_definitions/Accounts");
const { PaymentMethods } = require("../model_definitions/PaymentMethods");
const { Receipts } = require("../model_definitions/Receipts");

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