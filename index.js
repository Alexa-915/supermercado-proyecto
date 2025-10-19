// index.js
require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./config/database');

// Importa modelos
const Producto = require('./models/Producto');

// Middleware para leer JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/users', require('./routes/user'));       
app.use('/productos', require('./routes/producto')); 

// Sincronizar tablas y arrancar servidor
sequelize.sync({ alter: true })
  .then(() => {
    console.log('🧩 Tablas sincronizadas');
    app.listen(3001, () => console.log("Hola prendido"));
  })
  .catch(err => console.error('Error al sincronizar:', err));
