// scripts/verificar_admins.js
// 🔍 Script para verificar administradores en la base de datos

require('dotenv').config();
const sequelize = require('../config/database');
const Administrador = require('../models/Administrador');

async function verificarAdmins() {
  try {
    console.log('\n🔍 ===== VERIFICANDO ADMINISTRADORES =====\n');

    await sequelize.authenticate();
    console.log('✅ Conexión a base de datos exitosa\n');

    // Buscar todos los admins
    const admins = await Administrador.findAll();

    if (admins.length === 0) {
      console.log('❌ NO HAY ADMINISTRADORES EN LA BASE DE DATOS\n');
      console.log('💡 Ejecuta: node scripts/crear_admin_inicial.js\n');
      process.exit(1);
    }

    console.log(`📋 TOTAL DE ADMINISTRADORES: ${admins.length}\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    admins.forEach((admin, index) => {
      console.log(`${index + 1}. ADMINISTRADOR #${admin.id}`);
      console.log(`   👤 Nombre: ${admin.nombre}`);
      console.log(`   📧 Correo: ${admin.correo}`);
      console.log(`   📧 Correo (longitud): ${admin.correo.length} caracteres`);
      console.log(`   📧 Correo (trim): "${admin.correo.trim()}"`);
      console.log(`   🔑 Contraseña (hash): ${admin.contrasena.substring(0, 20)}...`);
      console.log(`   🔑 Hash comienza con: ${admin.contrasena.substring(0, 7)}`);
      console.log(`   📱 Teléfono: ${admin.telefono || 'No especificado'}`);
      console.log(`   🔒 Rol: ${admin.rol}`);
      console.log(`   ✅ Activo: ${admin.activo ? 'Sí' : 'No'}`);
      console.log(`   📅 Creado: ${admin.created_at.toLocaleString('es-CO')}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    });

    // Intentar buscar por el correo específico
    console.log('🔍 Buscando: admin@lafortuna.com\n');
    const adminBuscado = await Administrador.findOne({
      where: { correo: 'admin@lafortuna.com' }
    });

    if (adminBuscado) {
      console.log('✅ ADMIN ENCONTRADO CON BÚSQUEDA EXACTA');
    } else {
      console.log('❌ ADMIN NO ENCONTRADO CON BÚSQUEDA EXACTA');
      console.log('💡 Puede haber espacios o caracteres ocultos en el correo');
    }

    console.log('\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

verificarAdmins();