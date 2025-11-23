// controllers/adminController.js
// 🎯 Controlador para el panel de administrador

const Cliente = require('../models/Cliente');
const Producto = require('../models/Producto');
const Venta = require('../models/Venta');
const DetalleVenta = require('../models/DetalleVenta');
const Administrador = require('../models/Administrador');
const { Op } = require('sequelize');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📊 DASHBOARD - Estadísticas generales
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

exports.getDashboard = async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const [
      totalClientes,
      totalProductos,
      totalVentas,
      ventasHoy,
      ingresosHoy,
      productosBajoStock
    ] = await Promise.all([
      // Total de clientes registrados
      Cliente.count(),
      
      // Total de productos
      Producto.count(),
      
      // Total de ventas (todas)
      Venta.count(),
      
      // Ventas de hoy
      Venta.count({
        where: {
          fecha: {
            [Op.gte]: hoy
          }
        }
      }),
      
      // Ingresos de hoy
      Venta.sum('total', {
        where: {
          fecha: {
            [Op.gte]: hoy
          }
        }
      }),
      
      // Productos con stock bajo (menos de 10)
      Producto.count({
        where: {
          stock: {
            [Op.lt]: 10
          }
        }
      })
    ]);

    res.json({
      totalClientes,
      totalProductos,
      totalVentas,
      ventasHoy,
      ingresosHoy: ingresosHoy || 0,
      productosBajoStock,
      admin: req.admin
    });

  } catch (error) {
    console.error('❌ Error al obtener dashboard:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas del dashboard' });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 👥 GESTIÓN DE CLIENTES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

exports.getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      attributes: ['id', 'nombre', 'correo', 'telefono', 'direccion', 'created_at'],
      order: [['created_at', 'DESC']]
    });

    res.json(clientes);

  } catch (error) {
    console.error('❌ Error al obtener clientes:', error);
    res.status(500).json({ message: 'Error al obtener lista de clientes' });
  }
};

exports.getClienteById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const cliente = await Cliente.findByPk(id, {
      include: [{
        model: Venta,
        include: [DetalleVenta]
      }]
    });

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.json(cliente);

  } catch (error) {
    console.error('❌ Error al obtener cliente:', error);
    res.status(500).json({ message: 'Error al obtener datos del cliente' });
  }
};

exports.buscarClientes = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: 'Debes ingresar al menos 2 caracteres' });
    }

    const clientes = await Cliente.findAll({
      where: {
        [Op.or]: [
          { nombre: { [Op.iLike]: `%${q}%` } },
          { correo: { [Op.iLike]: `%${q}%` } },
          { telefono: { [Op.iLike]: `%${q}%` } }
        ]
      },
      limit: 20
    });

    res.json(clientes);

  } catch (error) {
    console.error('❌ Error al buscar clientes:', error);
    res.status(500).json({ message: 'Error al buscar clientes' });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 GESTIÓN DE PRODUCTOS (CRUD COMPLETO)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

exports.getProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      order: [['nombre', 'ASC']]
    });

    res.json(productos);

  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};

exports.getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(producto);

  } catch (error) {
    console.error('❌ Error al obtener producto:', error);
    res.status(500).json({ message: 'Error al obtener producto' });
  }
};

exports.crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria, imagen } = req.body;

    // Validaciones
    if (!nombre || !precio || !stock) {
      return res.status(400).json({ 
        message: 'Nombre, precio y stock son obligatorios' 
      });
    }

    const producto = await Producto.create({
      nombre,
      descripcion,
      precio,
      stock,
      categoria,
      imagen
    });

    console.log(`✅ [Admin] Producto creado: ${producto.nombre} por ${req.admin.nombre}`);
    res.status(201).json({ 
      message: 'Producto creado exitosamente',
      producto 
    });

  } catch (error) {
    console.error('❌ Error al crear producto:', error);
    res.status(500).json({ message: 'Error al crear producto' });
  }
};

exports.actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, categoria, imagen } = req.body;

    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    await producto.update({
      nombre,
      descripcion,
      precio,
      stock,
      categoria,
      imagen
    });

    console.log(`✅ [Admin] Producto actualizado: ${producto.nombre} por ${req.admin.nombre}`);
    res.json({ 
      message: 'Producto actualizado exitosamente',
      producto 
    });

  } catch (error) {
    console.error('❌ Error al actualizar producto:', error);
    res.status(500).json({ message: 'Error al actualizar producto' });
  }
};

exports.eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const nombreProducto = producto.nombre;
    await producto.destroy();

    console.log(`✅ [Admin] Producto eliminado: ${nombreProducto} por ${req.admin.nombre}`);
    res.json({ message: 'Producto eliminado exitosamente' });

  } catch (error) {
    console.error('❌ Error al eliminar producto:', error);
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
};

exports.buscarProductos = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: 'Debes ingresar al menos 2 caracteres' });
    }

    const productos = await Producto.findAll({
      where: {
        [Op.or]: [
          { nombre: { [Op.iLike]: `%${q}%` } },
          { descripcion: { [Op.iLike]: `%${q}%` } },
          { categoria: { [Op.iLike]: `%${q}%` } }
        ]
      },
      limit: 20
    });

    res.json(productos);

  } catch (error) {
    console.error('❌ Error al buscar productos:', error);
    res.status(500).json({ message: 'Error al buscar productos' });
  }
};

exports.getProductosBajoStock = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      where: {
        stock: {
          [Op.lt]: 10
        }
      },
      order: [['stock', 'ASC']]
    });

    res.json(productos);

  } catch (error) {
    console.error('❌ Error al obtener productos bajo stock:', error);
    res.status(500).json({ message: 'Error al obtener productos con bajo stock' });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 💰 GESTIÓN DE VENTAS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

exports.getVentas = async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      include: [
        { 
          model: Cliente, 
          attributes: ['nombre', 'correo'] 
        },
        { 
          model: DetalleVenta,
          include: [{ 
            model: Producto,
            attributes: ['nombre', 'precio']
          }]
        }
      ],
      order: [['fecha', 'DESC']],
      limit: 100
    });

    res.json(ventas);

  } catch (error) {
    console.error('❌ Error al obtener ventas:', error);
    res.status(500).json({ message: 'Error al obtener historial de ventas' });
  }
};

exports.getVentaById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const venta = await Venta.findByPk(id, {
      include: [
        { model: Cliente },
        { 
          model: DetalleVenta,
          include: [Producto]
        }
      ]
    });

    if (!venta) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    res.json(venta);

  } catch (error) {
    console.error('❌ Error al obtener venta:', error);
    res.status(500).json({ message: 'Error al obtener detalles de la venta' });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📊 REPORTES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

exports.getReporteVentas = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    const where = {};
    if (fechaInicio && fechaFin) {
      where.fecha = {
        [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
      };
    }

    const ventas = await Venta.findAll({
      where,
      include: [
        { model: Cliente, attributes: ['nombre'] },
        { model: DetalleVenta, include: [Producto] }
      ],
      order: [['fecha', 'DESC']]
    });

    const totalVentas = ventas.length;
    const ingresoTotal = ventas.reduce((sum, venta) => sum + parseFloat(venta.total), 0);

    res.json({
      totalVentas,
      ingresoTotal,
      ventas
    });

  } catch (error) {
    console.error('❌ Error al generar reporte:', error);
    res.status(500).json({ message: 'Error al generar reporte de ventas' });
  }
};

exports.getProductosMasVendidos = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const productosVendidos = await DetalleVenta.findAll({
      attributes: [
        'producto_id',
        [sequelize.fn('SUM', sequelize.col('cantidad')), 'total_vendido']
      ],
      include: [{
        model: Producto,
        attributes: ['nombre', 'precio', 'imagen']
      }],
      group: ['producto_id', 'Producto.id'],
      order: [[sequelize.literal('total_vendido'), 'DESC']],
      limit: parseInt(limit)
    });

    res.json(productosVendidos);

  } catch (error) {
    console.error('❌ Error al obtener productos más vendidos:', error);
    res.status(500).json({ message: 'Error al obtener productos más vendidos' });
  }
};