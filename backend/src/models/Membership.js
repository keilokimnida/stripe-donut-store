const { Membership } = require("../model_definitions/Membership");

// Get cart by account id
module.exports.findAllMemberships = () => Membership.findAll();