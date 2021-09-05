const { DataTypes } = require("sequelize");
const db = require("../config/connection");

const Products = db.define(
    "Products",
    {
        product_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        product_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        product_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    },
    {
        tableName: "products",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        paranoid: true,
        deletedAt: "deleted_at"
    }
);

module.exports = { Products };