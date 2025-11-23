// index.js - CONFIGURACIÓN CORS MEJORADA
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

/* ========= CORS MEJORADO ========= */
app.use(cors({
  origin: function(origin, callback) {
    // Permitir requests sin origen (como file://) durante desarrollo
    const allowedOrigins = [
      'http://127.0.0.1:5500',
      'http://localhost:5500',
      'http://127.0.0.1:5501',
      'http://localhost:5501'
    ];
    
    // Permitir requests sin origen (archivos locales) en desarrollo
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Temporal: permitir todos los orígenes en desarrollo
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware para headers adicionales (backup)
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ========= SESSION ========= */
app.use(session({
  secret: process.env.SESSION_SECRET || 'clave_super_secreta',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

app.use(passport.initialize());
app.use(passport.session());

/* ========= MODELOS ========= */
require('./models/Producto');
require('./models/Cliente');
require('./models/Administrador');
require('./models/Empleado');
require('./models/Venta');
require('./models/DetalleVenta');

/* ========= RUTAS ========= */
app.use('/users', require('./routes/user'));
app.use('/productos', require('./routes/producto'));
app.use('/clientes', require('./routes/cliente'));
app.use('/administradores', require('./routes/administrador'));
app.use('/empleados', require('./routes/empleado'));
app.use('/ventas', require('./routes/venta'));
app.use('/detalle-ventas', require('./routes/detalleVenta'));
app.use('/auth', require('./routes/auth'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    ok: true, 
    mensaje: '✅ Backend funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta para ver tablas
app.get("/debug/tables", async (req, res) => {
  try {
    const [tables] = await sequelize.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);
    res.json(tables);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las tablas" });
  }
});

/* ========= MANEJO DE ERRORES ========= */
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    mensaje: err.message 
  });
});

/* ========= ARRANCAR CON DB ========= */
sequelize.sync({ alter: true })
  .then(() => {
    console.log('🧩 Tablas sincronizadas correctamente con Aiven PostgreSQL');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📍 Prueba la conexión en: http://localhost:${PORT}/`);
    });
  })
  .catch(err => {
    console.error('❌ Error al sincronizar:', err);
  });