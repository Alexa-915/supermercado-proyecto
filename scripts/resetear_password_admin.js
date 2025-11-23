// scripts/resetear_password_admin.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const Administrador = require('../models/Administrador');

async function resetearPassword() {
  try {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question("📧 Correo del administrador: ", async (correo) => {
      const admin = await Administrador.findOne({ 
        where: { correo: correo.trim().toLowerCase() }
      });

      if (!admin) {
        console.log("❌ No existe un administrador con ese correo");
        readline.close();
        return process.exit(1);
      }

      readline.question("🔐 Nueva contraseña: ", async (pass1) => {
        readline.question("🔐 Confirmar contraseña: ", async (pass2) => {
          if (pass1 !== pass2) {
            console.log("❌ Las contraseñas no coinciden");
            readline.close();
            return process.exit(1);
          }

          const hash = await bcrypt.hash(pass1, 10);
          admin.contrasena = hash;
          await admin.save();

          console.log("\n✅ Contraseña actualizada correctamente");
          console.log("Puedes iniciar sesión con la nueva contraseña.\n");

          readline.close();
          process.exit(0);
        });
      });
    });

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

resetearPassword();
