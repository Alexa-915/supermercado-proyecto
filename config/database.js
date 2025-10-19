const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config(); // Carga las variables del archivo .env

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT,
  }
);

module.exports = sequelize;