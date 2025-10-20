const express = require('express');
const router = express.Router();
const detalleVentaController = require('../controllers/detalleVenta');

// Rutas CRUD
router.post('/', detalleVentaController.crear);
router.get('/', detalleVentaController.listar);
router.get('/:id', detalleVentaController.obtenerUno);
router.put('/:id', detalleVentaController.actualizar);
router.delete('/:id', detalleVentaController.eliminar);

module.exports = router;
