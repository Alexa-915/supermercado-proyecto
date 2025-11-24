// index.js - BACKEND COMPLETO + STRIPE INTEGRADO (CORREGIDO)
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

/* =====================================================
   🛡  CORS COMPLETAMENTE CONFIGURADO
===================================================== */
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        'http://127.0.0.1:5500',
        'http://localhost:5500',
        'http://127.0.0.1:5501',
        'http://localhost:5501',
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // permitir temporalmente
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Backup para evitar errores
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

/* =====================================================
   📦  PARSEADORES (IMPORTANTE: ORDEN CORRECTO)
===================================================== */
// ⚠️ CRÍTICO: Stripe webhooks necesitan raw body ANTES de express.json()
const bodyParser = require('body-parser');

// Webhook de Stripe DEBE ir ANTES de express.json()
app.use('/payments/webhook', bodyParser.raw({ type: 'application/json' }));

// Ahora sí, parsear JSON para el resto de rutas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =====================================================
   🔐  SESIONES + PASSPORT
===================================================== */
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'clave_super_secreta',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

/* =====================================================
   🗄  MODELOS (CARGA AUTOMÁTICA)
===================================================== */
require('./models/Producto');
require('./models/Cliente');
require('./models/Administrador');
require('./models/Empleado');
require('./models/Venta');
require('./models/DetalleVenta');

/* =====================================================
   🚦  RUTAS DEL SISTEMA
===================================================== */
app.use('/users', require('./routes/user'));
app.use('/productos', require('./routes/producto'));
app.use('/clientes', require('./routes/cliente'));
app.use('/api/admin', require('./routes/admin'));
app.use('/empleados', require('./routes/empleado'));
app.use('/ventas', require('./routes/venta'));
app.use('/detalle-ventas', require('./routes/detalleVenta'));
app.use('/auth', require('./routes/auth'));

/* =====================================================
   💳  PASARELA DE PAGOS (STRIPE)
===================================================== */
// ✅ Solo si el archivo existe, carga la ruta
try {
  const pagoRoutes = require('./routes/pago');
  app.use('/payments', pagoRoutes);
  console.log('✅ Rutas de pago (Stripe) cargadas correctamente');
} catch (error) {
  console.log('⚠️  Rutas de pago no disponibles (archivo no encontrado)');
  console.log('💡 Si necesitas pagos, crea el archivo routes/pago.js');
}

/* =====================================================
   🔍  RUTA DE PRUEBA
===================================================== */
app.get('/', (req, res) => {
  res.json({
    ok: true,
    mensaje: '✅ Backend funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

/* =====================================================
   🔧 DEBUG DE TABLAS
===================================================== */
app.get('/debug/tables', async (req, res) => {
  try {
    const [tables] = await sequelize.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);
    res.json(tables);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las tablas' });
  }
});

/* =====================================================
   ❌ MANEJO GLOBAL DE ERRORES
===================================================== */
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    mensaje: err.message,
  });
});

/* =====================================================
   🚀 INICIAR SERVIDOR + DB
===================================================== */
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('🧩 Tablas sincronizadas correctamente con Aiven PostgreSQL');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📍 Prueba la conexión en: http://localhost:${PORT}/`);
    });
  })
  .catch((err) => {
    console.error('❌ Error al sincronizar:', err);
  });