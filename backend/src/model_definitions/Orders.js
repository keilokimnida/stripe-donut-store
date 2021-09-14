const { DataTypes } = require("sequelize");
const db = require("../config/connection");
const { Accounts } = require("./Accounts");

const Orders = db.define(
    "Orders",
    {
        receipt_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        stripe_payment_method_type: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        stripe_payment_method_last_four_digit: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        refunded: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        fk_account_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: Accounts,
                key: "account_id"
            }
        },
    },
    {
        tableName: "orders",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        paranoid: true,
        deletedAt: "deleted_at"
    }
);

Orders.hasMany(Accounts, {
    foreignKey: "fk_account_id",
    as: "account",
    constraints: false
});

Accounts.belongsTo(Orders, {
    foreignKey: "fk_account_id",
    as: "order",
    constraints: false
});

module.exports = { Orders };