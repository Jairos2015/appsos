import { Sequelize } from 'sequelize';
import config from '../config/config.js'
//
console.log(config.development)

const sequelize = new Sequelize(
  config.development.database, 
  config.development.username, 
  config.development.password, {
    host: config.development.localhost,
    dialect: 'postgres'
  }
);
var db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// module.exports = db;
export default db
