const DetalleVenta = require('../models/DetalleVenta');
const Producto = require('../models/Producto');
const Venta = require('../models/Venta');

const detalleVentaController = {};

// Crear detalle de venta
detalleVentaController.crear = async (req, res) => {
  try {
    const { ventaId, productoId, cantidad, subtotal } = req.body;

    if (!ventaId || !productoId || !cantidad || !subtotal) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const nuevo = await DetalleVenta.create({ ventaId, productoId, cantidad, subtotal });
    return res.status(201).json(nuevo);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Listar todos
detalleVentaController.listar = async (req, res) => {
  try {
    const detalles = await DetalleVenta.findAll({
      include: [Venta, Producto]
    });
    return res.json(detalles);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Obtener uno
detalleVentaController.obtenerUno = async (req, res) => {
  try {
    const detalle = await DetalleVenta.findByPk(req.params.id, {
      include: [Venta, Producto]
    });
    if (!detalle) return res.status(404).json({ error: 'Detalle no encontrado' });
    return res.json(detalle);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Actualizar
detalleVentaController.actualizar = async (req, res) => {
  try {
    const detalle = await DetalleVenta.findByPk(req.params.id);
    if (!detalle) return res.status(404).json({ error: 'Detalle no encontrado' });
    await detalle.update(req.body);
    return res.json(detalle);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Eliminar
detalleVentaController.eliminar = async (req, res) => {
  try {
    const detalle = await DetalleVenta.findByPk(req.params.id);
    if (!detalle) return res.status(404).json({ error: 'Detalle no encontrado' });
    await detalle.destroy();
    return res.json({ mensaje: 'Detalle eliminado correctamente' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = detalleVentaController;
