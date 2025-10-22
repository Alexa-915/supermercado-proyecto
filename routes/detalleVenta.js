const express = require('express');
const router = express.Router();
const detalleVentaController = require('../controllers/detalleVenta');

router.post('/', detalleVentaController.crear);          // Crear
router.get('/', detalleVentaController.listar);          // Listar todos
router.get('/:id', detalleVentaController.obtenerUno);   // Obtener uno
router.put('/:id', detalleVentaController.actualizar);   // Actualizar
router.delete('/:id', detalleVentaController.eliminar);  // Eliminar

module.exports = router;
