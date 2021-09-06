const { DataTypes } = require("sequelize");
const db = require("../config/connection");
const { Membership } = require("./Membership");

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

module.exports = { Accounts };