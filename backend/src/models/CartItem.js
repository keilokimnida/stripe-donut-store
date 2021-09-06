const { DataTypes } = require("sequelize");
const db = require("../config/connection");

const { Accounts } = require("./Accounts");
const { Products } = require("./Products");

const CartItem = db.define(
    "CartItem",
    {
        cart_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        fk_account_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: Accounts,
                key: "account_id"
            }
        },
        fk_product_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: Products,
                key: "product_id"
            }
        },
        quantity: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        }
    },
    {
        tableName: "cart_item",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

Accounts.hasMany(CartItem, {
    foreignKey: "fk_account_id",
    as: "cartItem" // Account has many cart item
});

CartItem.belongsTo(Accounts, {
    foreignKey: "fk_account_id",
    as: "account" // each cart item has a accountid
});

Products.hasMany(CartItem, {
    foreignKey: "fk_product_id",
    as: "cartItem" // Product has many cart item
});

CartItem.belongsTo(Products, {
    foreignKey: "fk_product_id",
    as: "product" // each cart item has a productid
});


module.exports = { CartItem };