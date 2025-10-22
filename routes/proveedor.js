// routes/producto.js
const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedor');

router.post('/', proveedorController.crear);
router.get('/', proveedorController.listar);
router.get('/:id', proveedorController.obtenerUno);
router.put('/:id', proveedorController.actualizar);
router.delete('/:id', proveedorController.eliminar);

module.exports = router;
