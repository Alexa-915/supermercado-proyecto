// routes/producto.js
const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto');

router.post('/', productoController.crear);         // Crear
router.get('/', productoController.listar);         // Listar todos
router.get('/:id', productoController.obtenerUno);  // Obtener uno
router.put('/:id', productoController.actualizar);  // Actualizar
router.delete('/:id', productoController.eliminar);// Eliminar

module.exports = router;
