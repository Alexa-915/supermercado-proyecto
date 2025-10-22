const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Venta = require('./Venta');

const Pago = sequelize.define('Pago', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  monto: { type: DataTypes.FLOAT, allowNull: false },
  metodo: { type: DataTypes.STRING, allowNull: false },
  fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  ventaId: { type: DataTypes.INTEGER, allowNull: true } 
}, {
  tableName: 'pagos',
  timestamps: true
});

Pago.belongsTo(Venta, { foreignKey: 'ventaId', onDelete: 'SET NULL' });

module.exports = Pago;
