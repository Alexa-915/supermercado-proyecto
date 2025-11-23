require('dotenv').config();
const { Sequelize } = require('sequelize');
const Cliente = require('../models/Cliente');
const sequelize = require('../config/database');

async function limpiarUsuariosGoogle() {
  try {
    console.log('\n🔍 ===== VERIFICANDO USUARIOS EN LA BASE DE DATOS =====\n');
    
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a base de datos exitosa\n');
    
    // Buscar TODOS los clientes
    const todosLosClientes = await Cliente.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    console.log(`📊 Total de clientes en la BD: ${todosLosClientes.length}\n`);
    console.log('════════════════════════════════════════════════════════\n');
    
    // Mostrar todos los clientes
    todosLosClientes.forEach((cliente, index) => {
      console.log(`👤 Cliente ${index + 1}:`);
      console.log(`   🆔 ID: ${cliente.id}`);
      console.log(`   📧 Email: ${cliente.correo}`);
      console.log(`   👤 Nombre: ${cliente.nombre} ${cliente.apellido || ''}`);
      console.log(`   🔑 Contraseña: ${cliente.contrasena === 'GOOGLE_AUTH' ? 'GOOGLE_AUTH (registrado con Google)' : 'Hash (registrado manualmente)'}`);
      console.log(`   📅 Creado: ${cliente.createdAt.toLocaleString()}`);
      console.log('   ────────────────────────────────────────────────────');
    });
    
    console.log('\n════════════════════════════════════════════════════════\n');
    
    // Buscar usuarios con GOOGLE_AUTH que NO deberían existir
    const usuariosGoogle = await Cliente.findAll({
      where: { contrasena: 'GOOGLE_AUTH' }
    });
    
    if (usuariosGoogle.length === 0) {
      console.log('✅ No hay usuarios creados automáticamente con Google\n');
    } else {
      console.log(`⚠️  Se encontraron ${usuariosGoogle.length} usuario(s) con contraseña GOOGLE_AUTH:\n`);
      
      usuariosGoogle.forEach((usuario, index) => {
        console.log(`${index + 1}. ${usuario.correo} (ID: ${usuario.id})`);
      });
      
      console.log('\n⚠️  ESTOS USUARIOS FUERON CREADOS AUTOMÁTICAMENTE');
      console.log('⚠️  Si NO se registraron manualmente, deberían ser eliminados\n');
      
      await eliminarUsuariosGoogle(usuariosGoogle);
    }
    
    console.log('════════════════════════════════════════════════════════\n');
    console.log('✅ Verificación completada\n');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Función para eliminar usuarios (usar con PRECAUCIÓN)
async function eliminarUsuariosGoogle(usuarios) {
  console.log('\n🗑️  ===== ELIMINANDO USUARIOS =====\n');
  
  for (const usuario of usuarios) {
    try {
      await usuario.destroy();
      console.log(`✅ Eliminado: ${usuario.correo} (ID: ${usuario.id})`);
    } catch (err) {
      console.error(`❌ Error al eliminar ${usuario.correo}:`, err.message);
    }
  }
  
  console.log('\n✅ Limpieza completada\n');
}

// Ejecutar
limpiarUsuariosGoogle();