// models/Cliente.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  correo: { type: DataTypes.STRING, allowNull: false, unique: true },
  telefono: { type: DataTypes.STRING, allowNull: true },
  direccion: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'clientes',
  timestamps: true
});

module.exports = Cliente;
