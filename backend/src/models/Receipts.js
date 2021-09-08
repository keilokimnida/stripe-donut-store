const { DataTypes } = require("sequelize");
const db = require("../config/connection");
const { Accounts } = require("./Accounts");

const Receipts = db.define(
    "Receipts",
    {
        receipt_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        stripe_receipt_url: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        stripe_payment_method_card: {
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
        tableName: "receipts",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        paranoid: true,
        deletedAt: "deleted_at"
    }
);

Accounts.belongsTo(Receipts, {
    foreignKey: "fk_account_id",
    as: "receipt",
    constraints: false
});

Receipts.hasMany(Accounts, {
    foreignKey: "fk_account_id",
    as: "account",
    constraints: false
});

module.exports = { Receipts };