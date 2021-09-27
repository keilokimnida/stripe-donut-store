const { findAllMemberships, findMembership } = require('../models/membership');

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

// Get membership by type
module.exports.findMembership = async (req, res) => {
    try {
        const { type } = req.params;

        if (!type) return res.status(400).json({
            message: "Invalid parameter \"type\""
        });

        const membership = await findMembership(type);

        if (!membership) return res.status(404).json({
            message: `\"membership\" not found`
        });

        return res.status(200).send(membership);

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > membership.js! " + error);
    }
};