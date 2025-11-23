// models/Administrador.js
// 🔐 Modelo de Administrador para Sequelize

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Administrador = sequelize.define('Administrador', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre no puede estar vacío'
      },
      len: {
        args: [3, 100],
        msg: 'El nombre debe tener entre 3 y 100 caracteres'
      }
    }
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      msg: 'Este correo ya está registrado'
    },
    validate: {
      isEmail: {
        msg: 'Debe ser un correo válido'
      }
    }
  },
  contrasena: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La contraseña es obligatoria'
      }
    }
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  rol: {
    type: DataTypes.STRING(20),
    defaultValue: 'admin',
    validate: {
      isIn: {
        args: [['admin', 'superadmin', 'moderador']],
        msg: 'Rol inválido'
      }
    }
  },
  foto_perfil: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'administradores',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 🔒 Método para ocultar contraseña en respuestas JSON
Administrador.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  delete values.contrasena; // No enviar contraseña al frontend
  return values;
};

module.exports = Administrador;