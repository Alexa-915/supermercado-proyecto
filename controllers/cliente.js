// controllers/cliente.js - VERSIÓN COMPLETA
const Cliente = require('../models/Cliente');
const bcrypt = require('bcryptjs');

const clienteController = {};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📝 CREAR CLIENTE (REGISTRO)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
clienteController.crear = async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasena } = req.body;

    if (!nombre || !apellido || !correo || !contrasena) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const existe = await Cliente.findOne({ where: { correo } });
    if (existe) {
      return res.status(400).json({ error: 'Este correo ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contrasena, salt);

    const nuevo = await Cliente.create({
      nombre,
      apellido,
      correo,
      contrasena: hash
    });

    return res.status(201).json({
      mensaje: 'Cliente registrado correctamente',
      cliente: { 
        id: nuevo.id, 
        nombre: nuevo.nombre, 
        correo: nuevo.correo 
      }
    });
  } catch (err) {
    console.error('❌ Error en registro:', err);
    return res.status(500).json({ error: err.message });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📋 LISTAR TODOS LOS CLIENTES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
clienteController.listar = async (req, res) => {
  try {
    const clientes = await Cliente.findAll({ 
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['contrasena'] } // No enviar contraseña
    });
    return res.json(clientes);
  } catch (err) {
    console.error('❌ Error al listar:', err);
    return res.status(500).json({ error: err.message });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔍 OBTENER UN CLIENTE POR ID
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
clienteController.obtenerUno = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id, {
      attributes: { exclude: ['contrasena'] } // No enviar contraseña
    });
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    return res.json(cliente);
  } catch (err) {
    console.error('❌ Error al obtener cliente:', err);
    return res.status(500).json({ error: err.message });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ✏️ ACTUALIZAR INFORMACIÓN DEL CLIENTE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
clienteController.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Campos permitidos para actualizar
    const camposPermitidos = [
      'nombre', 
      'apellido', 
      'telefono', 
      'documento', 
      'genero', 
      'fecha_nacimiento', 
      'direccion', 
      'ciudad'
    ];

    // Actualizar solo los campos permitidos que vengan en el body
    const datosActualizar = {};
    camposPermitidos.forEach(campo => {
      if (req.body[campo] !== undefined) {
        datosActualizar[campo] = req.body[campo];
      }
    });

    await cliente.update(datosActualizar);

    // Retornar cliente sin contraseña
    const clienteActualizado = await Cliente.findByPk(id, {
      attributes: { exclude: ['contrasena'] }
    });

    console.log(`✅ Cliente actualizado - ID: ${id} - ${cliente.nombre}`);
    
    return res.json({
      mensaje: 'Información actualizada correctamente',
      cliente: clienteActualizado
    });

  } catch (err) {
    console.error('❌ Error al actualizar:', err);
    return res.status(500).json({ error: err.message });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔐 CAMBIAR CONTRASEÑA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
clienteController.cambiarContrasena = async (req, res) => {
  try {
    const { id } = req.params;
    const { contrasena_actual, nueva_contrasena } = req.body;

    if (!contrasena_actual || !nueva_contrasena) {
      return res.status(400).json({ 
        error: 'Debes proporcionar la contraseña actual y la nueva' 
      });
    }

    const cliente = await Cliente.findByPk(id);
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Verificar que la contraseña actual sea correcta
    const esValida = await bcrypt.compare(contrasena_actual, cliente.contrasena);
    
    if (!esValida) {
      return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
    }

    // Encriptar nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(nueva_contrasena, salt);

    await cliente.update({ contrasena: hash });

    console.log(`✅ Contraseña actualizada - Cliente ID: ${id}`);

    return res.json({ 
      mensaje: 'Contraseña actualizada correctamente' 
    });

  } catch (err) {
    console.error('❌ Error al cambiar contraseña:', err);
    return res.status(500).json({ error: err.message });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🗑️ ELIMINAR CLIENTE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
clienteController.eliminar = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    await cliente.destroy();
    
    console.log(`✅ Cliente eliminado - ID: ${req.params.id}`);
    
    return res.json({ mensaje: 'Cliente eliminado correctamente' });
  } catch (err) {
    console.error('❌ Error al eliminar:', err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = clienteController;