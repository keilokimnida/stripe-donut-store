const { Products } = require("../model_definitions/Products");

module.exports.findAllProducts = () => Products.findAll();

module.exports.findProductByProductID = (productID) => Products.findOne({
    where: {
        product_id: productID
    }
});