const { Membership } = require("../models/Membership");

// Get cart by account id
module.exports.findAllMemberships = () => Membership.findAll();