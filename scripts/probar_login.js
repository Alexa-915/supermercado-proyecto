// scripts/probar_login.js
// 🧪 Script para probar login de administrador manualmente

require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const Administrador = require('../models/Administrador');

async function probarLogin() {
  try {
    console.log('\n🧪 ===== PROBANDO LOGIN MANUAL =====\n');

    await sequelize.authenticate();
    console.log('✅ Conexión exitosa\n');

    // Credenciales a probar
    const correoProbar = 'admin@lafortuna.com';
    const contrasenaProbar = 'admin123';

    console.log(`📧 Buscando admin con correo: "${correoProbar}"`);
    console.log(`🔑 Contraseña a verificar: "${contrasenaProbar}"\n`);

    // Buscar admin
    const admin = await Administrador.findOne({
      where: { correo: correoProbar.toLowerCase().trim() }
    });

    if (!admin) {
      console.log('❌ ADMIN NO ENCONTRADO');
      console.log('💡 El correo no existe en la base de datos\n');
      
      // Mostrar todos los correos que existen
      const todosAdmins = await Administrador.findAll();
      console.log('📋 Correos registrados:');
      todosAdmins.forEach(a => {
        console.log(`   - "${a.correo}" (longitud: ${a.correo.length})`);
      });
      console.log('\n');
      process.exit(1);
    }

    console.log('✅ ADMIN ENCONTRADO:');
    console.log(`   👤 Nombre: ${admin.nombre}`);
    console.log(`   📧 Correo: ${admin.correo}`);
    console.log(`   🔒 Rol: ${admin.rol}`);
    console.log(`   ✅ Activo: ${admin.activo}\n`);

    // Verificar si está activo
    if (!admin.activo) {
      console.log('❌ CUENTA DESACTIVADA\n');
      process.exit(1);
    }

    // Probar contraseña
    console.log('🔐 Verificando contraseña...');
    console.log(`   Hash en BD: ${admin.contrasena.substring(0, 30)}...`);

    const esValida = await bcrypt.compare(contrasenaProbar, admin.contrasena);

    if (esValida) {
      console.log('\n✅ ✅ ✅ CONTRASEÑA CORRECTA ✅ ✅ ✅\n');
      console.log('🎉 EL LOGIN DEBERÍA FUNCIONAR\n');
      console.log('💡 Si sigue fallando en Thunder Client, el problema está en:');
      console.log('   1. La ruta /auth/admin/login no está registrada');
      console.log('   2. El código de routes/auth.js tiene un error');
      console.log('   3. Las sesiones no están configuradas\n');
    } else {
      console.log('\n❌ ❌ ❌ CONTRASEÑA INCORRECTA ❌ ❌ ❌\n');
      console.log('💡 Solución: Crear nuevo admin con:');
      console.log('   node scripts/crear_admin_inicial.js\n');
      console.log('   Y usa una contraseña diferente (ej: admin456)\n');
    }

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

probarLogin();