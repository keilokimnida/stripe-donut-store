// MODELS IMPORT
const { Accounts } = require("../src/models/Accounts");
const { Passwords } = require("../src/models/Passwords");
const { Products } = require("../src/models/Products");
const { CartItem } = require("../src/models/CartItem");
const { Membership } = require("../src/models/Membership");

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
                    description: "It's now or never, sign up now to get exclusive deals for Stripe Donuts!"
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