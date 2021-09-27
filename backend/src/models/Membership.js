const { Membership } = require("../model_definitions/Membership");

// Get cart by account id
module.exports.findAllMemberships = () => Membership.findAll();

module.exports.findMembership = (type) => Membership.findOne({
    where: {
        name: type
    }
});