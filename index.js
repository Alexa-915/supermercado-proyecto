// index.js
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const sequelize = require('./config/database'); // usa Aiven PostgreSQL

const app = express();
const PORT = process.env.PORT || 3001;

/* ========= CORS ========= */
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ========= SESSION ========= */
app.use(session({
  secret: process.env.SESSION_SECRET || 'clave_super_secreta',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: 'lax'
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

app.get('/', (req, res) => res.json({ ok: true }));

/* ========= ARRANCAR CON DB ========= */
sequelize.sync({ alter: true })
  .then(() => {
    console.log('🧩 Tablas sincronizadas correctamente con Aiven PostgreSQL');
    app.listen(PORT, () =>
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    );
  })
  .catch(err => console.error('❌ Error al sincronizar:', err));
