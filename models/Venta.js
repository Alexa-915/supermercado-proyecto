// models/Venta.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = require('./Cliente');
const Empleado = require('./Empleado');

const Venta = sequelize.define('Venta', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  total: { type: DataTypes.FLOAT, allowNull: false },
  metodo_pago: { type: DataTypes.STRING, allowNull: true },
  cliente_id: { type: DataTypes.INTEGER, allowNull: true },
  empleado_id: { type: DataTypes.INTEGER, allowNull: true }
}, {
  tableName: 'ventas',
  timestamps: true
});

Venta.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });
Venta.belongsTo(Empleado, { foreignKey: 'empleadoId', as: 'empleado' });

module.exports = Venta;
