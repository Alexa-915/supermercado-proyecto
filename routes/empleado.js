// routes/empleado.js
const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleado');

router.post('/', empleadoController.crear);
router.get('/', empleadoController.listar);
router.get('/:id', empleadoController.obtenerUno);
router.put('/:id', empleadoController.actualizar);
router.delete('/:id', empleadoController.eliminar);

module.exports = router;
