// routes/venta.js
const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/venta');

router.post('/', ventaController.crear);
router.get('/', ventaController.listar);
router.get('/:id', ventaController.obtenerUna);
router.put('/:id', ventaController.actualizar);
router.delete('/:id', ventaController.eliminar);

module.exports = router;
