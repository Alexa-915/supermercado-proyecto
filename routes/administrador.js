// routes/administrador.js
const express = require('express');
const router = express.Router();
const administradorController = require('../controllers/administrador');

router.post('/', administradorController.crear);
router.get('/', administradorController.listar);
router.get('/:id', administradorController.obtenerUno);
router.put('/:id', administradorController.actualizar);
router.delete('/:id', administradorController.eliminar);

module.exports = router;
