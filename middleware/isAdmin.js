// middleware/isAdmin.js
// 🔒 Middleware para proteger rutas que solo admins pueden acceder

const Administrador = require('../models/Administrador');

/**
 * Middleware que verifica si el usuario autenticado es un administrador válido
 * Debe usarse en todas las rutas del panel de administrador
 */
async function isAdmin(req, res, next) {
  try {
    // 1️⃣ Verificar si hay sesión de administrador
    if (!req.session.adminId) {
      return res.status(401).json({ 
        message: 'Acceso no autorizado. Debes iniciar sesión como administrador.',
        redirectTo: '/admin-login.html'
      });
    }

    // 2️⃣ Verificar que el tipo de usuario sea admin
    if (req.session.tipoUsuario !== 'admin') {
      return res.status(403).json({ 
        message: 'Acceso prohibido. Esta área es solo para administradores.',
        redirectTo: '/inicio.html'
      });
    }

    // 3️⃣ Buscar administrador en la base de datos
    const admin = await Administrador.findByPk(req.session.adminId);
    
    if (!admin) {
      // Admin no existe (fue eliminado)
      req.session.destroy();
      return res.status(401).json({ 
        message: 'Sesión inválida. Por favor inicia sesión nuevamente.',
        redirectTo: '/admin-login.html'
      });
    }

    // 4️⃣ Verificar que el admin esté activo
    if (!admin.activo) {
      req.session.destroy();
      return res.status(403).json({ 
        message: 'Tu cuenta ha sido desactivada. Contacta al superadministrador.',
        redirectTo: '/admin-login.html'
      });
    }

    // 5️⃣ Todo OK - Agregar info del admin al request
    req.admin = {
      id: admin.id,
      nombre: admin.nombre,
      correo: admin.correo,
      rol: admin.rol
    };

    console.log(`✅ [isAdmin] Acceso permitido - Admin: ${admin.nombre} (${admin.rol})`);
    next();

  } catch (error) {
    console.error('❌ [isAdmin] Error al verificar permisos:', error);
    return res.status(500).json({ 
      message: 'Error al verificar permisos de administrador'
    });
  }
}

/**
 * Middleware adicional para verificar si es SUPERADMIN
 * Usar solo en rutas críticas como crear/eliminar otros admins
 */
function isSuperAdmin(req, res, next) {
  if (!req.admin) {
    return res.status(401).json({ 
      message: 'Acceso no autorizado'
    });
  }

  if (req.admin.rol !== 'superadmin') {
    return res.status(403).json({ 
      message: 'Acceso prohibido. Solo superadministradores pueden realizar esta acción.'
    });
  }

  console.log(`✅ [isSuperAdmin] Acceso permitido - Superadmin: ${req.admin.nombre}`);
  next();
}

module.exports = { isAdmin, isSuperAdmin };