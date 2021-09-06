const { Products } = require("../models/Products");

module.exports.findAllProducts = () => Products.findAll();

module.exports.findProductByProductID = (productID) => Products.findOne({
    where: {
        product_id: productID
    }
});