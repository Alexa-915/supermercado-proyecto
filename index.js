// index.js
require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./config/database');

// Importa modelos
const Producto = require('./models/Producto');
const Cliente = require('./models/Cliente'); 
const Administrador = require('./models/Administrador');
const Empleado = require('./models/Empleado');

// Middleware para leer JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/users', require('./routes/user'));
app.use('/productos', require('./routes/producto'));
app.use('/clientes', require('./routes/cliente'));
app.use('/administradores', require('./routes/administrador'));
app.use('/empleados', require('./routes/empleado'));




// Sincronizar tablas y arrancar servidor
sequelize.sync({ alter: true })
  .then(() => {
    console.log('🧩 Tablas sincronizadas');
    app.listen(3001, () => console.log("Hola prendido"));
  })
  .catch(err => console.error('Error al sincronizar:', err));
