const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pago = sequelize.define('Pago', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  clienteId: { type: DataTypes.INTEGER, allowNull: true },
  stripeSessionId: { type: DataTypes.STRING, allowNull: false, unique: true },
  amount: { type: DataTypes.INTEGER, allowNull: false }, // en centavos
  currency: { type: DataTypes.STRING, defaultValue: 'usd' },
  status: { type: DataTypes.STRING, defaultValue: 'pending' }, // pending, completed, failed
  metadata: { type: DataTypes.JSONB, allowNull: true }
}, {
  tableName: 'Pago',
  timestamps: true
});

module.exports = Pago;