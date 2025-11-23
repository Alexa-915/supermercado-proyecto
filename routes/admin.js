// routes/admin.js
// 🛣️ Rutas del panel de administrador

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin, isSuperAdmin } = require('../middleware/isAdmin');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔒 Todas las rutas requieren autenticación de admin
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.use(isAdmin);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📊 DASHBOARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.get('/dashboard', adminController.getDashboard);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 👥 GESTIÓN DE CLIENTES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.get('/clientes', adminController.getClientes);
router.get('/clientes/buscar', adminController.buscarClientes);
router.get('/clientes/:id', adminController.getClienteById);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 GESTIÓN DE PRODUCTOS (CRUD COMPLETO)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.get('/productos', adminController.getProductos);
router.get('/productos/buscar', adminController.buscarProductos);
router.get('/productos/bajo-stock', adminController.getProductosBajoStock);
router.get('/productos/:id', adminController.getProductoById);
router.post('/productos', adminController.crearProducto);
router.put('/productos/:id', adminController.actualizarProducto);
router.delete('/productos/:id', adminController.eliminarProducto);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 💰 GESTIÓN DE VENTAS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.get('/ventas', adminController.getVentas);
router.get('/ventas/:id', adminController.getVentaById);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📊 REPORTES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.get('/reportes/ventas', adminController.getReporteVentas);
router.get('/reportes/productos-mas-vendidos', adminController.getProductosMasVendidos);

module.exports = router;