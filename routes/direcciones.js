const express = require('express');
const router = express.Router();
const { Direccion } = require('../models');

// Listar direcciones del cliente
router.get('/', async (req, res) => {
  try {
    const { cliente_id } = req.query;
    const direcciones = await Direccion.findAll({ where: { cliente_id } });
    res.json(direcciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear dirección
router.post('/', async (req, res) => {
  try {
    const direccion = await Direccion.create(req.body);
    res.status(201).json(direccion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar dirección
router.delete('/:id', async (req, res) => {
  try {
    await Direccion.destroy({ where: { id: req.params.id } });
    res.json({ mensaje: 'Dirección eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;