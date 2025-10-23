const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

// Ruta para iniciar login con Google
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

// Callback de Google
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/auth/error'
  }),
  (req, res) => {
    // Éxito - mostrar JSON con datos del usuario
    res.json({
      message: 'Login con Google exitoso',
      user: {
        id: req.user.id,
        name: req.user.displayName,
        email: req.user.emails[0].value,
        photo: req.user.photos[0].value
      }
    });
  }
);

// Ruta de error
router.get('/error', (req, res) => {
  res.json({ error: 'Error en la autenticación con Google' });
});

// Verificar estado de autenticación
router.get('/status', (req, res) => {
  res.json({ 
    authenticated: req.isAuthenticated(),
    user: req.user 
  });
});

// Cerrar sesión
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Sesión cerrada correctamente' });
  });
});

module.exports = router;