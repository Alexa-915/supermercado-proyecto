const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pago');

router.post('/', pagoController.crear);
router.get('/', pagoController.listar);
router.get('/:id', pagoController.obtenerUno);
router.put('/:id', pagoController.actualizar);
router.delete('/:id', pagoController.eliminar);

module.exports = router;
