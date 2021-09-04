const authController = require("./controllers/auth");

module.exports = router => {

    // Default URL check
    router.get("/", (req, res) => {
        res.status(200).send("안녕하세요~! Donut store api is functioning properly");
    })

    // LOGIN
    router.post("/api/v1/login", authController.clientLogin);

};