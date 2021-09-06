const { findAllMemberships } = require('../services/membership');

// Get all memberships
module.exports.findAllMemberships = async (req, res) => {
    try {
        const memberships = await findAllMemberships();

        if (!memberships) return res.status(404).json({
            message: `\"memberships\" not found`
        });

        return res.status(200).send(memberships);

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > membership.js! " + error);
    }
};