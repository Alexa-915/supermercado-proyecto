// models/Cliente.js - VERSIÓN COMPLETA
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  nombre: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  apellido: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  correo: { 
    type: DataTypes.STRING(150), 
    allowNull: false, 
    unique: true,
    validate: {
      isEmail: true
    }
  },
  contrasena: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  // ✅ NUEVOS CAMPOS AGREGADOS
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  documento: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  genero: {
    type: DataTypes.STRING(10),
    allowNull: true,
    validate: {
      isIn: [['M', 'F', 'Otro', '']]
    }
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  direccion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ciudad: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  foto_perfil: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'clientes',
  timestamps: true
});

module.exports = Cliente;   