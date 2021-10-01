const { DataTypes } = require("sequelize");
const db = require("../config/connection");
const { Subscription } = require("./Subscription");

const Transaction = db.define(
    "Transaction",
    {
        transaction_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        fk_subscription_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: Subscription,
                key: "subscription_id"
            }
        },
        stripe_card_exp_date: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        stripe_payment_method_type: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        stripe_payment_method_last_four_digit: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
    },
    {
        tableName: "invoice",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        paranoid: true,
        deletedAt: "deleted_at"
    }
);

Subscription.hasMany(Transaction, {
    foreignKey: "fk_subscription_id",
    as: "transaction"
});

Transaction.belongsTo(Subscription, {
    foreignKey: "fk_subscription_id",
    as: "subscription"
});

module.exports = { Transaction };