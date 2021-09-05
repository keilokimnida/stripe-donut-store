const { findAccountByID } = require('../services/account');

// Get account by ID

module.exports.findAccountByID = async (req, res) => {
    try {

        const accountID = parseInt(req.params.accountID);
        if (isNaN(accountID)) return res.status(400).send(r.error400({
            message: "Invalid parameter \"accountID\""
        }));

        const account = await findAccountByID(accountID);
        if (!account) return res.status(404).send(r.error404({
            message: `\"employeeId\" ${accountID} not found`
        }));

        return res.status(200).send(account);

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > account.js! " + error);
    }
}