// controllers/cliente.js
const Cliente = require('../models/Cliente');

const clienteController = {};

// Crear cliente
clienteController.crear = async (req, res) => {
  try {
    const { nombre, correo, telefono, direccion } = req.body;
    if (!nombre || !correo) return res.status(400).json({ error: 'nombre y correo son obligatorios' });
    const nuevo = await Cliente.create({ nombre, correo, telefono, direccion });
    return res.status(201).json(nuevo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Listar todos
clienteController.listar = async (req, res) => {
  try {
    const clientes = await Cliente.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(clientes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Obtener por id
clienteController.obtenerUno = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    return res.json(cliente);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Actualizar
clienteController.actualizar = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    await cliente.update(req.body);
    return res.json(cliente);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Eliminar
clienteController.eliminar = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    await cliente.destroy();
    return res.json({ mensaje: 'Cliente eliminado correctamente' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = clienteController;
