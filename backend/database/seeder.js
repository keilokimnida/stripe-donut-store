// MODELS IMPORT
const { Accounts } = require("../src/model_definitions/Accounts");
const { Passwords } = require("../src/model_definitions/Passwords");
const { Products } = require("../src/model_definitions/Products");
const { CartItem } = require("../src/model_definitions/CartItem");
const { Membership } = require("../src/model_definitions/Membership");
const { Order } = require("../src/model_definitions/Orders");

// SERVICES IMPORT
const { createStripeCustomer } = require("../src/services/stripe");

// NPM modules import
const faker = require("faker");
const bcrypt = require("bcryptjs");
const chalk = require('chalk');

module.exports.seeder = async () => {
    try {
        {
            // Create membership
            await Membership.bulkCreate([
                {
                    name: "Normal",
                    price: "0",
                },
                {
                    name: "Standard",
                    price: "9.90",
                    description: "It's now or never, sign up now to get exclusive deals for Stripe Donuts!",
                    stripe_product_id: "prod_KIoby9xxbqNiTU",
                    stripe_price_id: "price_1JeCxuK7vevnRCV25MS9wgpk"
                },
                {
                    name: "Premium",
                    price: "15.90",
                    description: "The best membership.",
                    stripe_product_id: "prod_KJg7nfcsl4M2is",
                    stripe_price_id: "price_1Jf2koK7vevnRCV2wo8qWXwx"
                }
            ]);
        }
        {
            // Create user
            const firstname = faker.name.firstName();
            const lastname = faker.name.lastName();
            const username = `${firstname}_${lastname}`.toLowerCase();
            const email = `${username}@stripedonut.com`;
            const fullName = lastname + " " + firstname;

            const customer = await createStripeCustomer(email, fullName);
            const stripeCustomerID = customer.id;

            await Accounts.create({
                username,
                firstname,
                lastname,
                email,
                membership: 2,
                passwords: [{
                    password: bcrypt.hashSync("123", 10)
                }],
                fk_membership_id: 1,
                stripe_customer_id: stripeCustomerID
            }, {
                include: ["passwords"]
            });


        }
        {
            // Insert products
            for (let i = 0; i < 10; i++) {
                let price = Math.round(faker.commerce.price() / 10) + 0.9;
                let productName = faker.lorem.word() + faker.lorem.word();
                productName = productName.charAt(0).toUpperCase() + productName.slice(1) + " Donut"; // capitalize the word
                let productDescription = faker.lorem.paragraph();

                await Products.create({
                    product_name: productName,
                    product_price: price,
                    description: productDescription
                });
            }

        }

        console.log(chalk.green("SEEDING COMPLETE"));
    } catch (error) {
        console.log(chalk.red("ERROR IN DATA SEEDING"), error);
    }
}