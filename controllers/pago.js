const Pago = require('../models/Pago');
const pagoController = {};

pagoController.crear = async (req, res) => {
  try {
    const { monto, metodo, fecha, ventaId } = req.body;
    if (!monto || !metodo)
      return res.status(400).json({ error: 'Monto y método son obligatorios' });

    const nuevo = await Pago.create({ monto, metodo, fecha, ventaId });
    return res.status(201).json(nuevo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

pagoController.listar = async (req, res) => {
  try {
    const pagos = await Pago.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(pagos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

pagoController.obtenerUno = async (req, res) => {
  try {
    const pago = await Pago.findByPk(req.params.id);
    if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });
    return res.json(pago);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

pagoController.actualizar = async (req, res) => {
  try {
    const pago = await Pago.findByPk(req.params.id);
    if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });
    await pago.update(req.body);
    return res.json(pago);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

pagoController.eliminar = async (req, res) => {
  try {
    const pago = await Pago.findByPk(req.params.id);
    if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });
    await pago.destroy();
    return res.json({ mensaje: 'Pago eliminado correctamente' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = pagoController;
