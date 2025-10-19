// routes/cliente.js
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente');

router.post('/', clienteController.crear);         // Crear
router.get('/', clienteController.listar);         // Listar todos
router.get('/:id', clienteController.obtenerUno);  // Obtener uno
router.put('/:id', clienteController.actualizar);  // Actualizar
router.delete('/:id', clienteController.eliminar); // Eliminar

module.exports = router;
