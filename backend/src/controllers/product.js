const { findAllProducts, findProductByProductID } = require('../services/product');

// READ

module.exports.findAllProducts = async (req, res) => {
    try {
        const products = await findAllProducts();

        if (products.length === 0) return res.status(204).send();

        return res.status(200).send(products);

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > product.js! " + error);
    }
}

module.exports.findProductByProductID = async (req, res) => {
    try {
        const productID = parseInt(req.params.productID);

        if (isNaN(productID)) return res.status(400).json({
            message: "Invalid parameter \"productID\""
        });

        const product = await findProductByProductID(productID);

        if (!product) return res.status(204).send();

        return res.status(200).send(product);

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error in controller > product.js! " + error);
    }
}