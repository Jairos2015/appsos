import { DataTypes, Model } from 'sequelize';
// import db from './sequelizeconnect.js'; // Importa la instancia de Sequelize configurada
// let sequelize = db.sequelize
import { Sequelize } from 'sequelize';
import config from '../config/config.js'
//
// console.log(config.development)

const sequelize = new Sequelize(
  config.development.database, 
  config.development.username, 
  config.development.password, {
    host: config.development.localhost,
    dialect: 'postgres'
  }
);
///
const db = {}
class User extends Model {
  static associate(models) {
    this.hasMany(models.Geolocation, { foreignKey: 'userID' });
    this.hasMany(models.EventUser, { foreignKey: 'phoneEvent', sourceKey: 'phone' });
  }
}
User.init({
  pais: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dpto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ciudad: {
    type: DataTypes.STRING,
    allowNull: false
  },
  barrio: {
    type: DataTypes.STRING,
    allowNull: false
  },
  vereda: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastFriends: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastLocation: DataTypes.GEOMETRY,
},
{
  sequelize,
  modelName: 'User'
});


class Geolocation extends Model {
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userID' });
  }
}
Geolocation.init({
  socketID: DataTypes.STRING,
  location: DataTypes.GEOMETRY,
  phonetrack: {
    type: DataTypes.STRING,
    allowNull: false
  },
  online: DataTypes.BOOLEAN,
  trackerID: DataTypes.INTEGER,
}, {
  sequelize,
  modelName: 'Geolocation'
});
// User.hasMany(Geolocation, { foreignKey: 'userID' });
// Geolocation.belongsTo(User, { foreignKey: 'userID' });


class EventUser extends Model {
  static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'phoneEvent', targetKey: 'phone' });
  }
}
EventUser.init({
  eventName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estado: DataTypes.STRING,
  tipo: DataTypes.STRING,
  phoneEvent: DataTypes.STRING,
  activa: DataTypes.BOOLEAN,
  comments: DataTypes.STRING,
  location: DataTypes.GEOMETRY('POINT'),
}, {
  sequelize,
  modelName: 'EventUser'
});
// User.hasMany(EventUser, { foreignKey: 'userID', sourceKey: 'phone' });
// EventUser.belongsTo(User, { foreignKey: 'userID', targetKey: 'phone' });


// Establecer relaciones
/*
User.hasMany(Geolocation, { foreignKey: 'userID' });
User.hasMany(EventUser, { foreignKey: 'userID', sourceKey: 'phone' });
Geolocation.belongsTo(User, { foreignKey: 'userID' });
EventUser.belongsTo(User, { foreignKey: 'userID', targetKey: 'phone' });
*/
// Sincronizar modelos con la base de datos
await sequelize.sync()
// await sequelize.sync({ force: true })
  .then(() => {
    console.log('Modelos sincronizados con la base de datos');
  })
  .catch(err => {
    console.error('Error al sincronizar modelos:', err);
  });

  db.User = User
  db.Geolocation = Geolocation
  db.EventUser = EventUser
  //
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  export { db }