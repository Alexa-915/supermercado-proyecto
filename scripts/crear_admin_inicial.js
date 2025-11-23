// scripts/crear_admin_inicial.js
// 🔧 Script para crear el primer administrador en la base de datos
// Ejecutar: node scripts/crear_admin_inicial.js

require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const Administrador = require('../models/Administrador');

async function crearAdminInicial() {
  try {
    console.log('\n🔐 ===== CREADOR DE ADMINISTRADOR INICIAL =====\n');

    // 1️⃣ Conectar a la base de datos
    console.log('📡 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa\n');

    // 2️⃣ Sincronizar modelo (crear tabla si no existe)
    console.log('📋 Sincronizando tabla de administradores...');
    await Administrador.sync({ alter: true });
    console.log('✅ Tabla sincronizada\n');

    // 3️⃣ Verificar si ya existe un administrador
    const adminExistente = await Administrador.findOne();
    
    if (adminExistente) {
      console.log('⚠️  YA EXISTE AL MENOS UN ADMINISTRADOR\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📧 Email: ${adminExistente.correo}`);
      console.log(`👤 Nombre: ${adminExistente.nombre}`);
      console.log(`🆔 ID: ${adminExistente.id}`);
      console.log(`🔒 Rol: ${adminExistente.rol}`);
      console.log(`✅ Activo: ${adminExistente.activo ? 'Sí' : 'No'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      // Preguntar si quiere crear otro
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      readline.question('¿Deseas crear OTRO administrador? (s/n): ', async (respuesta) => {
        readline.close();
        
        if (respuesta.toLowerCase() !== 's') {
          console.log('\n❌ Operación cancelada\n');
          process.exit(0);
        }
        
        await solicitarDatosAdmin();
      });
      
    } else {
      console.log('📝 No hay administradores en la base de datos');
      console.log('📝 Vamos a crear el PRIMER administrador...\n');
      await solicitarDatosAdmin();
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('💡 Verifica:');
    console.error('   1. Que tu archivo .env tenga DATABASE_URL');
    console.error('   2. Que la conexión a PostgreSQL funcione');
    console.error('   3. Que el modelo Administrador.js exista\n');
    process.exit(1);
  }
}

// 📝 Función para solicitar datos del admin
async function solicitarDatosAdmin() {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📝 DATOS DEL NUEVO ADMINISTRADOR');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  readline.question('👤 Nombre completo: ', (nombre) => {
    readline.question('📧 Correo electrónico: ', (correo) => {
      readline.question('📱 Teléfono (opcional, Enter para saltar): ', (telefono) => {
        readline.question('🔐 Rol (admin/superadmin/moderador) [admin]: ', (rol) => {
          readline.question('🔑 Contraseña (mínimo 6 caracteres): ', (contrasena) => {
            readline.question('🔐 Confirmar contraseña: ', async (confirmar) => {
              readline.close();

              // Validaciones
              if (!nombre || nombre.trim().length < 3) {
                console.log('\n❌ El nombre debe tener al menos 3 caracteres\n');
                process.exit(1);
              }

              if (!correo || !correo.includes('@')) {
                console.log('\n❌ Debes ingresar un correo válido\n');
                process.exit(1);
              }

              if (contrasena !== confirmar) {
                console.log('\n❌ Las contraseñas no coinciden\n');
                process.exit(1);
              }

              if (contrasena.length < 6) {
                console.log('\n❌ La contraseña debe tener al menos 6 caracteres\n');
                process.exit(1);
              }

              const rolFinal = rol.trim() || 'admin';
              if (!['admin', 'superadmin', 'moderador'].includes(rolFinal)) {
                console.log('\n❌ Rol inválido. Usa: admin, superadmin o moderador\n');
                process.exit(1);
              }

              try {
                // Verificar si el correo ya existe
                const existe = await Administrador.findOne({ 
                  where: { correo: correo.trim().toLowerCase() } 
                });
                
                if (existe) {
                  console.log('\n❌ Ya existe un administrador con ese correo\n');
                  process.exit(1);
                }

                // Encriptar contraseña
                console.log('\n🔒 Encriptando contraseña...');
                const hash = await bcrypt.hash(contrasena, 10);

                // Crear administrador
                console.log('💾 Guardando en base de datos...');
                const nuevoAdmin = await Administrador.create({
                  nombre: nombre.trim(),
                  correo: correo.trim().toLowerCase(),
                  contrasena: hash,
                  telefono: telefono.trim() || null,
                  rol: rolFinal,
                  activo: true
                });

                console.log('\n✅ ===== ADMINISTRADOR CREADO EXITOSAMENTE =====\n');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log(`🆔 ID: ${nuevoAdmin.id}`);
                console.log(`👤 Nombre: ${nuevoAdmin.nombre}`);
                console.log(`📧 Correo: ${nuevoAdmin.correo}`);
                console.log(`📱 Teléfono: ${nuevoAdmin.telefono || 'No especificado'}`);
                console.log(`🔒 Rol: ${nuevoAdmin.rol}`);
                console.log(`✅ Activo: Sí`);
                console.log(`📅 Creado: ${nuevoAdmin.created_at.toLocaleString('es-CO')}`);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
                
                console.log('🎉 ¡Puedes iniciar sesión con estas credenciales!');
                console.log(`🌐 URL: http://localhost:3001/auth/admin/login`);
                console.log('\n💡 Guarda estas credenciales en un lugar seguro\n');

                process.exit(0);

              } catch (err) {
                console.error('\n❌ Error al crear administrador:', err.message);
                if (err.name === 'SequelizeUniqueConstraintError') {
                  console.error('💡 Este correo ya está registrado\n');
                } else if (err.name === 'SequelizeValidationError') {
                  console.error('💡 Datos inválidos:', err.errors.map(e => e.message).join(', '));
                }
                process.exit(1);
              }
            });
          });
        });
      });
    });
  });
}

// 🚀 Ejecutar
crearAdminInicial();