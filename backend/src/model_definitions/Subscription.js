const { DataTypes } = require("sequelize");
const db = require("../config/connection");
const { Membership } = require("./Membership");
const { PaymentMethods } = require("./PaymentMethods");
const { Accounts } = require("./Accounts");

const Subscription = db.define(
    "Subscription",
    {
        subscription_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        fk_membership_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: Membership,
                key: "membership_id"
            }
        },
        fk_account_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: Accounts,
                key: "account_id"
            }
        },
        // Stripe
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
        // Default payment method
        fk_payment_method: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            references: {
                model: PaymentMethods,
                key: "payment_methods_id"
            }
        },
        stripe_subscription_payment_intent_status: {
            type: DataTypes.ENUM(["succeeded", "requires_payment_method", "requires_action"]),        // can be either succeeded, requires_payment_method, or requires_action
            allowNull: true,
        },
        stripe_subscription_status: {
            // ENUM data type maps each valid string value to an index starting at 1
            // 1 = active, 2 = past_due, ...
            // Only the specified values below are valid in string
            // https://stripe.com/docs/api/subscriptions/object
            type: DataTypes.ENUM(["active", "past_due", "unpaid", "canceled", "incomplete", "incomplete_expired", "trialing"]),
            allowNull: true
        }
        // To include start date, end date, next billing date
    },
    {
        tableName: "subscription",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        paranoid: true,
        deletedAt: "deleted_at"
    }
);

Accounts.hasMany(Subscription, {
    foreignKey: "fk_account_id",
    as: "subscription"
});

Subscription.belongsTo(Accounts, {
    foreignKey: "fk_account_id",
    as: "account"
});

Membership.hasMany(Subscription, {
    foreignKey: "fk_membership_id",
    as: "subscription"
});

Subscription.belongsTo(Membership, {
    foreignKey: "fk_membership_id",
    as: "membership"
});

PaymentMethods.hasMany(Subscription, {
    foreignKey: "fk_payment_method",
    as: "subscription",
});

Subscription.belongsTo(PaymentMethods, {
    foreignKey: "fk_payment_method",
    as: "payment_method",
});

module.exports = { Subscription };