// controllers/empleado.js
const Empleado = require('../models/Empleado');

const empleadoController = {};

// Crear empleado
empleadoController.crear = async (req, res) => {
  try {
    const { nombre, correo, contrasena, telefono, cargo, salario, fecha_contratacion, estado } = req.body;
    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({ error: 'nombre, correo y contrasena son obligatorios' });
    }
    const nuevo = await Empleado.create({ nombre, correo, contrasena, telefono, cargo, salario, fecha_contratacion, estado });
    return res.status(201).json(nuevo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Listar todos
empleadoController.listar = async (req, res) => {
  try {
    const empleados = await Empleado.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(empleados);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Obtener uno por id
empleadoController.obtenerUno = async (req, res) => {
  try {
    const empleado = await Empleado.findByPk(req.params.id);
    if (!empleado) return res.status(404).json({ error: 'Empleado no encontrado' });
    return res.json(empleado);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Actualizar
empleadoController.actualizar = async (req, res) => {
  try {
    const empleado = await Empleado.findByPk(req.params.id);
    if (!empleado) return res.status(404).json({ error: 'Empleado no encontrado' });
    await empleado.update(req.body);
    return res.json(empleado);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Eliminar
empleadoController.eliminar = async (req, res) => {
  try {
    const empleado = await Empleado.findByPk(req.params.id);
    if (!empleado) return res.status(404).json({ error: 'Empleado no encontrado' });
    await empleado.destroy();
    return res.json({ mensaje: 'Empleado eliminado correctamente' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = empleadoController;
