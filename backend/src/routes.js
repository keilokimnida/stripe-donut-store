module.exports = router => {
    router.get("/", (req, res) => {
        res.status(200).send("안녕하세요~! Donut store api is functioning properly");
    })
};