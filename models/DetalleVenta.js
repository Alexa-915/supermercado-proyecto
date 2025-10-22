const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Venta = require('./Venta');
const Producto = require('./Producto');

const DetalleVenta = sequelize.define('DetalleVenta', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  subtotal: { type: DataTypes.FLOAT, allowNull: false }
}, {
  tableName: 'detalle_ventas',
  timestamps: true
});

// Relaciones
Venta.hasMany(DetalleVenta, { foreignKey: 'ventaId', onDelete: 'CASCADE' });
DetalleVenta.belongsTo(Venta, { foreignKey: 'ventaId' });

Producto.hasMany(DetalleVenta, { foreignKey: 'productoId', onDelete: 'CASCADE' });
DetalleVenta.belongsTo(Producto, { foreignKey: 'productoId' });

module.exports = DetalleVenta;
