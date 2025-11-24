// routes/cliente.js - VERSIÓN COMPLETA
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📋 RUTAS BÁSICAS DE CLIENTES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.post('/', clienteController.crear);              // Crear
router.get('/', clienteController.listar);              // Listar todos
router.get('/:id', clienteController.obtenerUno);       // Obtener uno
router.put('/:id', clienteController.actualizar);       // Actualizar info

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔐 RUTA PARA CAMBIAR CONTRASEÑA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.put('/:id/cambiar-contrasena', clienteController.cambiarContrasena);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🗑️ ELIMINAR CLIENTE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.delete('/:id', clienteController.eliminar);

module.exports = router;