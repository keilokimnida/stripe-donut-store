const { Products } = require("../models/Products");

module.exports.findAllProducts = () => Products.findAll();