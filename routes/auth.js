// routes/auth.js - VERSIÓN ULTRA SEGURA 🔒
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Cliente = require('../models/Cliente');
const passport = require('../config/passport');
const Administrador = require('../models/Administrador');

// ========================================
// 🔹 REGISTRO MANUAL
// ========================================
router.post('/register', async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasena } = req.body;
    
    console.log('\n📝 ===== INTENTO DE REGISTRO =====');
    console.log('📧 Email:', correo);
    
    if (!nombre || !apellido || !correo || !contrasena) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Verificar si ya existe
    const existe = await Cliente.findOne({ where: { correo } });
    if (existe) {
      console.log('❌ Email ya registrado:', correo);
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Encriptar contraseña
    const hash = await bcrypt.hash(contrasena, 10);
    
    const nuevoCliente = await Cliente.create({
      nombre,
      apellido,
      correo,
      contrasena: hash
    });

    console.log('✅ Cliente registrado exitosamente - ID:', nuevoCliente.id);
    console.log('=================================\n');

    res.status(201).json({ 
      mensaje: 'Registro exitoso', 
      cliente: { 
        id: nuevoCliente.id, 
        nombre: nuevoCliente.nombre, 
        correo: nuevoCliente.correo 
      } 
    });
  } catch (err) {
    console.error('❌ Error en registro:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ========================================
// 🔹 INICIO DE SESIÓN MANUAL
// ========================================
router.post('/login', async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    
    console.log('\n🔐 ===== INTENTO DE LOGIN MANUAL =====');
    console.log('📧 Email:', correo);
    
    const cliente = await Cliente.findOne({ where: { correo } });

    if (!cliente) {
       console.log('❌ [Cliente Login] No registrado como cliente:', correo);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const valido = await bcrypt.compare(contrasena, cliente.contrasena);
    if (!valido) {
      console.log('❌ Contraseña incorrecta');
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    console.log('✅ Login exitoso - ID:', cliente.id);
    console.log('=====================================\n');

    res.json({ 
      mensaje: 'Inicio de sesión exitoso', 
      cliente: {
        id: cliente.id,
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        correo: cliente.correo
      }
    });
  } catch (err) {
    console.error('❌ Error en login:', err);
    res.status(500).json({ error: err.message });
  }
});

// ========================================
// 🔹 GOOGLE LOGIN - RUTA INICIAL
// ========================================
router.get('/google', (req, res, next) => {
  console.log('\n🔵 ===== INICIANDO AUTENTICACIÓN CON GOOGLE =====');
  
  // 🧹 LIMPIAR SESIÓN ANTES DE AUTENTICAR
  req.logout((err) => {
    if (err) {
      console.error('⚠️ Error al limpiar sesión:', err);
    } else {
      console.log('🧹 Sesión limpiada correctamente');
    }
    
    // Proceder con autenticación
    passport.authenticate('google', { 
      scope: ['profile', 'email'],
      prompt: 'select_account' // Fuerza a mostrar selector de cuenta
    })(req, res, next);
  });
});

// ========================================
// 🔹 GOOGLE CALLBACK - VALIDACIÓN ESTRICTA
// ========================================
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/auth/google/error',
    failureMessage: true,
    session: true
  }),
  async (req, res) => {
    try {
      console.log('\n✅ ===== CALLBACK DE GOOGLE =====');
      
      // 🔒 VALIDACIÓN ADICIONAL: Verificar que req.user existe
      if (!req.user) {
        console.log('❌ ERROR: req.user es undefined');
        return res.redirect('/auth/google/error');
      }
      
      // 🔒 VALIDACIÓN DOBLE: Buscar usuario en BD otra vez
      const cliente = await Cliente.findByPk(req.user.id);
      
      if (!cliente) {
        console.log('❌ ERROR: Usuario no encontrado en BD después de autenticar');
        console.log('🚫 ID buscado:', req.user.id);
        
        // Destruir sesión inmediatamente
        req.logout((err) => {
          if (err) console.error('Error al destruir sesión:', err);
        });
        
        return res.redirect('/auth/google/error');
      }
      
      console.log('✅ Usuario verificado correctamente');
      console.log('🆔 ID:', cliente.id);
      console.log('📧 Email:', cliente.correo);
      console.log('👤 Nombre:', cliente.nombre);
      console.log('================================\n');
      
      // ✅ TODO CORRECTO - Redirigir a página de usuario
      res.redirect('http://127.0.0.1:5500/inicio-usuarios.html');
      
    } catch (err) {
      console.error('\n❌ ERROR EN CALLBACK:');
      console.error('Error:', err.message);
      console.error('Stack:', err.stack);
      console.error('================================\n');
      
      // Destruir sesión en caso de error
      req.logout((logoutErr) => {
        if (logoutErr) console.error('Error al destruir sesión:', logoutErr);
      });
      
      res.redirect('/auth/google/error');
    }
  }
);

// ========================================
// 🔹 PÁGINA DE ERROR PARA GOOGLE
// ========================================
router.get('/google/error', (req, res) => {
  console.log('⚠️ Usuario redirigido a página de error de Google');
  
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Error - La Fortuna</title>
      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Quicksand', sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(to bottom right, #f6f8f5, #e8f5e9);
          margin: 0;
          padding: 20px;
        }
        .error-box {
          background: white;
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.15);
          text-align: center;
          max-width: 500px;
          animation: slideIn 0.5s ease;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        h2 { 
          color: #d32f2f; 
          margin-bottom: 15px;
          font-size: 24px;
        }
        p { 
          color: #666; 
          margin: 15px 0; 
          line-height: 1.6;
        }
        .important {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          text-align: left;
          border-radius: 5px;
        }
        .important strong {
          color: #856404;
        }
        .btn {
          background-color: #6DAA43;
          color: white;
          padding: 12px 30px;
          border: none;
          border-radius: 20px;
          font-weight: bold;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          margin: 10px 5px;
          transition: background-color 0.3s ease;
        }
        .btn:hover { 
          background-color: #568735; 
          transform: translateY(-2px);
        }
        .btn-secondary {
          background-color: #999;
        }
        .btn-secondary:hover {
          background-color: #777;
        }
      </style>
    </head>
    <body>
      <div class="error-box">
        <h2>🚫 Acceso Denegado</h2>
        <p><strong>Esta cuenta de Google NO está registrada en La Fortuna.</strong></p>
        
        <div class="important">
          <strong>⚠️ Importante:</strong> Para poder iniciar sesión con Google, primero debes crear una cuenta en nuestro sitio.
        </div>
        
        <p>Por favor, regístrate usando el formulario de registro y luego podrás usar Google para entrar más fácilmente.</p>
        
        <a href="http://127.0.0.1:5500/registro.html" class="btn">
          📝 Crear Cuenta Nueva
        </a>
        <a href="http://127.0.0.1:5500/iniciar-sesion.html" class="btn btn-secondary">
          🔙 Volver al Login
        </a>
      </div>
    </body>
    </html>
  `);
});

// ========================================
// 🔹 VERIFICAR AUTENTICACIÓN
// ========================================
router.get('/check', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ 
      autenticado: true, 
      usuario: {
        id: req.user.id,
        nombre: req.user.nombre,
        correo: req.user.correo
      }
    });
  } else {
    res.json({ autenticado: false });
  }
});

// ========================================
// 🔹 CERRAR SESIÓN
// ========================================
router.get('/logout', (req, res) => {
  const userEmail = req.user ? req.user.correo : 'Desconocido';
  
  console.log('\n🚪 ===== CERRANDO SESIÓN =====');
  console.log('👤 Usuario:', userEmail);
  
  req.logout((err) => {
    if (err) {
      console.error('❌ Error al cerrar sesión:', err);
      return res.status(500).json({ error: 'Error al cerrar sesión' });
    }
    
    console.log('✅ Sesión cerrada correctamente');
    console.log('============================\n');
    
    res.json({ mensaje: 'Sesión cerrada correctamente' });
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔐 AUTENTICACIÓN DE ADMINISTRADOR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 🔐 LOGIN ADMINISTRADOR
router.post('/admin/login', async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Validaciones básicas
    if (!correo || !contrasena) {
      return res.status(400).json({ 
        message: 'Correo y contraseña son obligatorios' 
      });
    }

    // Buscar administrador por correo
    const admin = await Administrador.findOne({ 
      where: { correo: correo.toLowerCase().trim() } 
    });

    if (!admin) {
      console.log(`❌ [Admin Login] Intento fallido - Correo no existe: ${correo}`);
      return res.status(401).json({ 
        message: 'Credenciales incorrectas' 
      });
    }

    // Verificar si el admin está activo
    if (!admin.activo) {
      console.log(`❌ [Admin Login] Cuenta desactivada: ${admin.correo}`);
      return res.status(403).json({ 
        message: 'Tu cuenta ha sido desactivada. Contacta al superadministrador.' 
      });
    }

    // Verificar contraseña
    const esValida = await bcrypt.compare(contrasena, admin.contrasena);
    
    if (!esValida) {
      console.log(`❌ [Admin Login] Contraseña incorrecta para: ${correo}`);
      return res.status(401).json({ 
        message: 'Credenciales incorrectas' 
      });
    }

    // 🎉 LOGIN EXITOSO - Crear sesión
    req.session.adminId = admin.id;
    req.session.tipoUsuario = 'admin';
    
    console.log(`✅ [Admin Login] Acceso concedido - ${admin.nombre} (${admin.rol}) - ${new Date().toLocaleString('es-CO')}`);

    res.json({
      message: 'Login exitoso',
      admin: {
        id: admin.id,
        nombre: admin.nombre,
        correo: admin.correo,
        rol: admin.rol
      }
    });

  } catch (error) {
    console.error('❌ [Admin Login] Error en el servidor:', error);
    res.status(500).json({ 
      message: 'Error en el servidor al procesar login' 
    });
  }
});

// ✅ VERIFICAR SESIÓN DE ADMINISTRADOR
router.get('/admin/check', async (req, res) => {
  try {
    // Verificar si hay sesión
    if (!req.session.adminId || req.session.tipoUsuario !== 'admin') {
      return res.status(401).json({ 
        authenticated: false,
        message: 'No hay sesión activa de administrador' 
      });
    }

    // Buscar admin en BD
    const admin = await Administrador.findByPk(req.session.adminId);

    if (!admin) {
      req.session.destroy();
      return res.status(401).json({ 
        authenticated: false,
        message: 'Sesión inválida' 
      });
    }

    if (!admin.activo) {
      req.session.destroy();
      return res.status(403).json({ 
        authenticated: false,
        message: 'Cuenta desactivada' 
      });
    }

    // Sesión válida
    res.json({
      authenticated: true,
      admin: {
        id: admin.id,
        nombre: admin.nombre,
        correo: admin.correo,
        rol: admin.rol,
        foto_perfil: admin.foto_perfil
      }
    });

  } catch (error) {
    console.error('❌ [Admin Check] Error:', error);
    res.status(500).json({ 
      authenticated: false,
      message: 'Error al verificar sesión' 
    });
  }
});

// 🚪 LOGOUT ADMINISTRADOR
router.get('/admin/logout', (req, res) => {
  const adminNombre = req.session.adminId ? 'Admin' : 'Desconocido';
  
  req.session.destroy((err) => {
    if (err) {
      console.error('❌ [Admin Logout] Error al cerrar sesión:', err);
      return res.status(500).json({ 
        message: 'Error al cerrar sesión' 
      });
    }
    
    console.log(`🚪 [Admin Logout] Sesión cerrada - ${adminNombre} - ${new Date().toLocaleString('es-CO')}`);
    res.json({ message: 'Sesión cerrada exitosamente' });
  });
});

module.exports = router;