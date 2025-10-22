const Proveedor = require('../models/Proveedor');
const proveedorController = {};

proveedorController.crear = async (req, res) => {
  try {
    const { nombre, correo, telefono, direccion } = req.body;
    if (!nombre || !correo)
      return res.status(400).json({ error: 'Nombre y correo son obligatorios' });
    const nuevo = await Proveedor.create({ nombre, correo, telefono, direccion });
    return res.status(201).json(nuevo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

proveedorController.listar = async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll();
    return res.json(proveedores);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

proveedorController.obtenerUno = async (req, res) => {
  try {
    const proveedor = await Proveedor.findByPk(req.params.id);
    if (!proveedor) return res.status(404).json({ error: 'Proveedor no encontrado' });
    return res.json(proveedor);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

proveedorController.actualizar = async (req, res) => {
  try {
    const proveedor = await Proveedor.findByPk(req.params.id);
    if (!proveedor) return res.status(404).json({ error: 'Proveedor no encontrado' });
    await proveedor.update(req.body);
    return res.json(proveedor);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

proveedorController.eliminar = async (req, res) => {
  try {
    const proveedor = await Proveedor.findByPk(req.params.id);
    if (!proveedor) return res.status(404).json({ error: 'Proveedor no encontrado' });
    await proveedor.destroy();
    return res.json({ mensaje: 'Proveedor eliminado correctamente' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = proveedorController;
