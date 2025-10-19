const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ruta al archivo

const Producto = sequelize.define('Producto', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: true },
  precio: { type: DataTypes.FLOAT, allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  categoria: { type: DataTypes.STRING, allowNull: true },
  imagen: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'productos',
  timestamps: true
});

module.exports = Producto;