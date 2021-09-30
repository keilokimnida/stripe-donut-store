const { DataTypes } = require("sequelize");
const db = require("../config/connection");
const { Membership } = require("./Membership");
const { PaymentMethods } = require("./PaymentMethods");

const Accounts = db.define(
    "Accounts",
    {
        account_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        firstname: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        fk_membership_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: Membership,
                key: "membership_id"
            }
        },
        // Stripe
        stripe_customer_id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        stripe_payment_intent_id: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true
        },
        stripe_payment_intent_client_secret: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true
        },
        stripe_subscription_id: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true
        },
        stripe_subscription_client_secret: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true
        },
        fk_subscription_default_payment_method: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            references: {
                model: PaymentMethods,
                key: "payment_methods_id"
            }
        },
        // maybe can convert this to enum
        stripe_subscription_payment_intent_status: {
            type: DataTypes.STRING(255),        // can be either succeeded, requires_payment_method, or requires_action
            allowNull: true,
            unique: false
        }
    },
    {
        tableName: "accounts",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        paranoid: true,
        deletedAt: "deleted_at"
    }
);

Membership.hasMany(Accounts, {
    foreignKey: "fk_membership_id",
    as: "account"
});

Accounts.belongsTo(Membership, {
    foreignKey: "fk_membership_id",
    as: "membership"
});

PaymentMethods.hasMany(Accounts, {
    foreignKey: "fk_subscription_default_payment_method",
    as: "account"
});

Accounts.belongsTo(PaymentMethods, {
    foreignKey: "fk_subscription_default_payment_method",
    as: "subscription_payment_method"
});

module.exports = { Accounts };