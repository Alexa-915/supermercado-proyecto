const DetalleVenta = require('../models/DetalleVenta');
const Venta = require('../models/Venta');
const Producto = require('../models/Producto');

const detalleVentaController = {};

// Crear un detalle de venta
detalleVentaController.crear = async (req, res) => {
  try {
    const { ventaId, productoId, cantidad, precio_unitario } = req.body;

    // Verificar que los datos existan
    if (!ventaId || !productoId || !cantidad || !precio_unitario) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Crear el detalle
    const nuevoDetalle = await DetalleVenta.create({
      ventaId,
      productoId,
      cantidad,
      precio_unitario
    });

    // Calcular el subtotal del nuevo detalle
    const subtotal = cantidad * precio_unitario;

    // Buscar la venta asociada
    const venta = await Venta.findByPk(ventaId);
    if (venta) {
      // Sumar el subtotal al total actual
      venta.total = (venta.total || 0) + subtotal;
      await venta.save();
    }

    return res.status(201).json({
      mensaje: 'Detalle agregado y total de venta actualizado',
      detalle: nuevoDetalle,
      nuevo_total: venta ? venta.total : null
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Listar todos los detalles
detalleVentaController.listar = async (req, res) => {
  try {
    const detalles = await DetalleVenta.findAll();
    return res.json(detalles);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Obtener un detalle por ID
detalleVentaController.obtenerUno = async (req, res) => {
  try {
    const detalle = await DetalleVenta.findByPk(req.params.id);
    if (!detalle) return res.status(404).json({ error: 'Detalle no encontrado' });
    return res.json(detalle);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Actualizar un detalle
detalleVentaController.actualizar = async (req, res) => {
  try {
    const detalle = await DetalleVenta.findByPk(req.params.id);
    if (!detalle) return res.status(404).json({ error: 'Detalle no encontrado' });

    await detalle.update(req.body);
    return res.json(detalle);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Eliminar un detalle (y actualizar total)
detalleVentaController.eliminar = async (req, res) => {
  try {
    const detalle = await DetalleVenta.findByPk(req.params.id);
    if (!detalle) return res.status(404).json({ error: 'Detalle no encontrado' });

    const venta = await Venta.findByPk(detalle.ventaId);
    if (venta) {
      const resta = detalle.cantidad * detalle.precio_unitario;
      venta.total = Math.max(0, venta.total - resta);
      await venta.save();
    }

    await detalle.destroy();
    return res.json({ mensaje: 'Detalle eliminado y total actualizado' });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = detalleVentaController;
