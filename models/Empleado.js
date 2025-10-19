// models/Empleado.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Empleado = sequelize.define('Empleado', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  correo: { type: DataTypes.STRING, allowNull: false, unique: true },
  contrasena: { type: DataTypes.STRING, allowNull: false },
  telefono: { type: DataTypes.STRING, allowNull: true },
  cargo: { type: DataTypes.STRING, allowNull: true },
  salario: { type: DataTypes.FLOAT, allowNull: true },
  fecha_contratacion: { type: DataTypes.DATE, allowNull: true },
  estado: { type: DataTypes.STRING, defaultValue: 'activo' }
}, {
  tableName: 'empleados',
  timestamps: true
});

module.exports = Empleado;
