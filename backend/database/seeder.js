// Model Imports
const { Accounts } = require("../src/models/Accounts");
const { Passwords } = require("../src/models/Passwords");

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
                passwords: [{
                    password: bcrypt.hashSync("123", 10)
                }]
            }, {
                include: ["passwords"]
            });
        }

        console.log("SEEDING COMPLETE");
    } catch (error) {
        console.log("ERROR IN DATA SEEDING", error);
    }
}