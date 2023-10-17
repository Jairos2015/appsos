// require("dotenv").config();
import dotenv from 'dotenv';
dotenv.config()
// export default {
let config= {}
export default config = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
  production: {
    use_env_variable: process.env.USE_ENV_VARIABLE,
    dialect: 'postgres'
  }
};