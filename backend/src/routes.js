// CONTROLLERS
const accountController = require("./controllers/account");
const authController = require("./controllers/auth");
const cartController = require("./controllers/cart");
const productController = require("./controllers/product");
const membershipController = require("./controllers/membership");
const stripeController = require("./controllers/stripe");

// MIDDLEWARES
const { isLoggedIn } = require("./middlewares/login");

module.exports = router => {

    // Default URL check
    router.get("/", (req, res) => {
        res.status(200).send("안녕하세요~! Donut store api is functioning properly");
    })

    // LOGIN
    router.post("/api/v1/login", authController.clientLogin);

    // STRIPE PAYMENT
    // With reference to https://stripe.com/docs/payments/integration-builder
    router.post("/api/v1/create-payment-intent", isLoggedIn, stripeController.createPaymentIntent);

    // ACCOUNT
    router.get("/api/v1/account/:accountID", isLoggedIn, accountController.findAccountByID);
    
    // PRODUCTS
    router.get("/api/v1/products", productController.findAllProducts);
    router.get("/api/v1/product/:productID", productController.findProductByProductID);

    // CART
    router.get("/api/v1/cart", isLoggedIn, cartController.findCartItemsByAccountID);
    router.get("/api/v1/cart/:productID", isLoggedIn, cartController.findCartItemByAccountIDAndProductID);
    router.post("/api/v1/cart", isLoggedIn, cartController.insertCartItem);
    router.put("/api/v1/cart", isLoggedIn, cartController.updateCartItem);
    router.delete("/api/v1/cart/:productID", isLoggedIn, cartController.deleteCartItem);
    router.delete("/api/v1/cart", isLoggedIn, cartController.deleteAllCartItemByAccountID);

    // MEMBERSHIP
    router.get("/api/v1/membership", membershipController.findAllMemberships);
};