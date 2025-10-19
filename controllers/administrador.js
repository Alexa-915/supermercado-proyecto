// controllers/administrador.js
const Administrador = require('../models/Administrador');

const administradorController = {};

// Crear administrador
administradorController.crear = async (req, res) => {
  try {
    const { nombre, correo, contrasena, telefono, rol } = req.body;
    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({ error: 'nombre, correo y contrasena son obligatorios' });
    }
    const nuevo = await Administrador.create({ nombre, correo, contrasena, telefono, rol });
    return res.status(201).json(nuevo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Listar todos
administradorController.listar = async (req, res) => {
  try {
    const administradores = await Administrador.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(administradores);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Obtener uno por id
administradorController.obtenerUno = async (req, res) => {
  try {
    const admin = await Administrador.findByPk(req.params.id);
    if (!admin) return res.status(404).json({ error: 'Administrador no encontrado' });
    return res.json(admin);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Actualizar
administradorController.actualizar = async (req, res) => {
  try {
    const admin = await Administrador.findByPk(req.params.id);
    if (!admin) return res.status(404).json({ error: 'Administrador no encontrado' });
    await admin.update(req.body);
    return res.json(admin);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Eliminar
administradorController.eliminar = async (req, res) => {
  try {
    const admin = await Administrador.findByPk(req.params.id);
    if (!admin) return res.status(404).json({ error: 'Administrador no encontrado' });
    await admin.destroy();
    return res.json({ mensaje: 'Administrador eliminado correctamente' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = administradorController;
