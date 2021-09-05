// Model Imports
const { Accounts } = require("../src/models/Accounts");
const { Passwords } = require("../src/models/Passwords");
const { Products } = require("../src/models/Products");
const { CartItem } = require("../src/models/CartItem");

// NPM modules import
const faker = require("faker");
const bcrypt = require("bcryptjs");

module.exports.seeder = async () => {
    try {
        {
            // Create user
            let firstname = faker.name.firstName();
            let lastname = faker.name.lastName();
            let username = `${firstname}_${lastname}`.toLowerCase();
            let email = `${username}@stripedonut.com`;

            await Accounts.create({
                username,
                firstname,
                lastname,
                email,
                membership: 2,
                passwords: [{
                    password: bcrypt.hashSync("123", 10)
                }]
            }, {
                include: ["passwords"]
            });
        }
        {
            // Insert products
            for (let i = 0; i < 10; i++) {
                let price = Math.round(faker.commerce.price() / 10) + 0.9;
                let productName = faker.lorem.word();
                productName = productName.charAt(0).toUpperCase() + productName.slice(1) + " Donut"; // capitalize the word

                await Products.create({
                    product_name: productName,
                    product_price: price
                });
            }

        }

        console.log("SEEDING COMPLETE");
    } catch (error) {
        console.log("ERROR IN DATA SEEDING", error);
    }
}