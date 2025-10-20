// controllers/venta.js
const Venta = require('../models/Venta');

const ventaController = {};

// Crear venta
ventaController.crear = async (req, res) => {
  try {
    const { fecha, total, metodo_pago, cliente_id, empleado_id } = req.body;
    if (total == null) {
      return res.status(400).json({ error: 'El total es obligatorio' });
    }
    const nueva = await Venta.create({ fecha, total, metodo_pago, cliente_id, empleado_id });
    return res.status(201).json(nueva);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Listar todas
ventaController.listar = async (req, res) => {
  try {
    const ventas = await Venta.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(ventas);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Obtener una por id
ventaController.obtenerUna = async (req, res) => {
  try {
    const venta = await Venta.findByPk(req.params.id);
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
    return res.json(venta);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Actualizar
ventaController.actualizar = async (req, res) => {
  try {
    const venta = await Venta.findByPk(req.params.id);
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
    await venta.update(req.body);
    return res.json(venta);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Eliminar
ventaController.eliminar = async (req, res) => {
  try {
    const venta = await Venta.findByPk(req.params.id);
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
    await venta.destroy();
    return res.json({ mensaje: 'Venta eliminada correctamente' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = ventaController;
