const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const Cliente = require('../models/Cliente');
const passport = require('../config/passport');

// 🧩 Sesión (necesario para Google)
router.use(session({
  secret: process.env.SESSION_SECRET || 'clave_super_secreta',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// 🔹 Registro manual
router.post('/register', async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasena } = req.body;
    if (!nombre || !apellido || !correo || !contrasena) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const existe = await Cliente.findOne({ where: { correo } });
    if (existe) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    const hash = await bcrypt.hash(contrasena, 10);
    const nuevoCliente = await Cliente.create({
      nombre,
      apellido,
      correo,
      contrasena: hash
    });

    res.status(201).json({ mensaje: 'Registro exitoso', cliente: nuevoCliente });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🔹 Inicio de sesión manual
router.post('/login', async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    const cliente = await Cliente.findOne({ where: { correo } });

    if (!cliente) return res.status(404).json({ error: 'Usuario no encontrado' });

    const valido = await bcrypt.compare(contrasena, cliente.contrasena);
    if (!valido) return res.status(401).json({ error: 'Contraseña incorrecta' });

    res.json({ mensaje: 'Inicio de sesión exitoso', cliente });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Login con Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/error' }),
  (req, res) => {
    console.log('✅ Usuario autenticado con Google:', req.user);
    res.redirect('http://127.0.0.1:5500/supermercado-frontend/index.html');
  }
);

// 🔹 Ruta de error
router.get('/error', (req, res) => {
  res.json({ error: 'Error en la autenticación con Google' });
});

// 🔹 Cerrar sesión
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.json({ mensaje: 'Sesión cerrada correctamente' });
  });
});

module.exports = router;
