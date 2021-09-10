const { findAccountByID } = require('../models/account');
const { findReceiptByAccountID } = require('../models/receipts');

// Get account by ID

module.exports.findAccountByID = async (req, res) => {
    try {

        const accountID = parseInt(req.params.accountID);
        if (isNaN(accountID)) return res.status(400).json({
            message: "Invalid parameter \"accountID\""
        });

        const account = await findAccountByID(accountID);
        if (!account) return res.status(404).json({
            message: `\"accountID\" ${accountID} not found`
        });

        const receipts = await findReceiptByAccountID(accountID);

        return res.status(200).send({
            account,
            receipts
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > account.js! " + error);
    }
}