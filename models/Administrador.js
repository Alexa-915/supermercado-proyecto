// models/Administrador.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Administrador = sequelize.define('Administrador', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  correo: { type: DataTypes.STRING, allowNull: false, unique: true },
  contrasena: { type: DataTypes.STRING, allowNull: false },
  telefono: { type: DataTypes.STRING, allowNull: true },
  rol: { type: DataTypes.STRING, defaultValue: 'admin' }
}, {
  tableName: 'administradores',
  timestamps: true
});

module.exports = Administrador;
