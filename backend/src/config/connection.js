const { db: { name, user, password, host, port } } = require("./config");
const { Sequelize } = require("sequelize");

const db = new Sequelize(name, user, password, {
    host, port, dialect: "mysql"
});

(async function () {
    try {
        await db.authenticate()
            .then(() => console.log("CONNECTED TO DATABASE SUCCESSFULLY"))
            .catch(error => {
                console.log(`FAILED TO CONNECT TO DATABASE: ${error}`);
                process.exit(1);
            });
    } catch (error) {
        console.log(error);
    }
})();

module.exports = db;
