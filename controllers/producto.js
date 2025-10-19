// controllers/producto.js
const Producto = require('../models/Producto');

const productoController = {};

// Crear producto
productoController.crear = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria, imagen } = req.body;
    if (!nombre || precio == null) return res.status(400).json({ error: 'nombre y precio son obligatorios' });
    const nuevo = await Producto.create({ nombre, descripcion, precio, stock, categoria, imagen });
    return res.status(201).json(nuevo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Listar todos
productoController.listar = async (req, res) => {
  try {
    const productos = await Producto.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(productos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Obtener por id
productoController.obtenerUno = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    return res.json(producto);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Actualizar
productoController.actualizar = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    await producto.update(req.body);
    return res.json(producto);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Eliminar
productoController.eliminar = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    await producto.destroy();
    return res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = productoController;
