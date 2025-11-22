// controllers/cliente.js
const Cliente = require('../models/Cliente');
const bcrypt = require('bcryptjs'); // para encriptar la contraseña

const clienteController = {};

// Crear cliente (REGISTRO)
clienteController.crear = async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasena } = req.body;

    // Validar campos obligatorios
    if (!nombre || !apellido || !correo || !contrasena)
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });

    // Verificar si ya existe el correo
    const existe = await Cliente.findOne({ where: { correo } });
    if (existe)
      return res.status(400).json({ error: 'Este correo ya está registrado' });

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contrasena, salt);

    // Crear cliente
    const nuevo = await Cliente.create({
      nombre,
      apellido,
      correo,
      contrasena: hash
    });

    return res.status(201).json({
      mensaje: 'Cliente registrado correctamente',
      cliente: { id: nuevo.id, nombre: nuevo.nombre, correo: nuevo.correo }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// (El resto de métodos: listar, obtener, actualizar, eliminar se pueden dejar igual)
clienteController.listar = async (req, res) => {
  try {
    const clientes = await Cliente.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(clientes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

//Obtener
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

//Actualizar
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

//Eliminar
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
