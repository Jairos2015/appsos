import {db} from '../models/index.js'
import bcrypt from 'bcrypt'
import userMiddleware from '../middlewares/middleware.js'
// import countryTable from "./data/countries.json" with { type: "json" };
// import countryTable from "./data/countries.json" assert { type: "json" };
import datos from '../seeders/bulkfile.json' assert { type: "json" };

import {handleJwt} from '../middlewares/handleJwt.js'
const Op = db.Sequelize.Op;
///
console.log(db.db)
const userController = {}
userController.get = async (req, res, next) => {
  res.send('respond with a resource get');
  console.log("userController: ")
}
userController.signup = async (req, res, next) => {
  const {
    body: { pais, dpto,  ciudad, barrio, vereda, nombre, phone, password, lastFriends,lastLocation },
  } = req;
  console.log(req.body)
  if (!phone) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // console.log(body)
  // const password = req.body.password;
  const encryptedPassword = bcrypt.hashSync(password, 10);
  console.log('antes: ');
    // Primero, iniciamos una transacción y la guardamos en una variable
  const t = await db.sequelize.transaction();
  try {
    const user = await db.User.create({  pais, dpto,  ciudad, barrio, vereda,nombre, phone, password: encryptedPassword, lastFriends,role: "user", lastLocation }, { transaction: t });
    console.log("USER register: " + JSON.stringify(user.dataValues))
    const devolver = {
      nombre: user.dataValues.nombre,
      lastFriends: user.dataValues.lastFriends,
      lastLocation: user.dataValues.lastLocation,
      phone:user.dataValues.phone
    }
    const token = handleJwt.signToken(devolver);
    //
    await db.Geolocation.create({ location: user.dataValues.lastLocation, phonetrack: user.dataValues.phone }, { transaction: t });
    await t.commit();
    res.status(201).send({
      success: true,
      message: "user successfully created",
      token,
      user: devolver
    });
    // Si la ejecución llega a esta línea, no se arrojaron errores.
  // Confirmamos la transacción.
  } catch (e) {
    console.error('ERROR: '+e)
    // t.rollback; transacciones
    // return Promise.reject(e);
    await t.rollback();
    res.status(500).send({
      message:
        e.message || "Some error occurred while creating the User."
    });
  }
  // res.send('respond with a resource signup');
  console.log("userController: ")
}


userController.login = async (req, res, next) => {
  // res.send('respond with a resource login');
  console.log("userController: login ")
  
// userRouter.post("/login", handleJwt.verifyToken ,async (req, res, next) => {
  console.log("Dentro de /login")
   const { body: { phone, password }, } = req;
   console.log(phone, " ", password)
   let user = {}
   let token
   let funcionLogin = function () { 
     let forSend = {
       success: true,
       message: "user successfully retrieved",
       user: userSend,
       token
     }
     // console.log("forSend{}: "+JSON.stringify(forSend))
     console.log("Envio datos: " + JSON.stringify(forSend));
     res.status(200).send(forSend);
   }
   console.log(req.userVerify)
   let userSend = {
     lastFriends: req.userVerify.lastFriends,
     lastLocation: req.userVerify.lastLocation,
     nombre: req.userVerify.nombre,
     phone: req.userVerify.phone
   }
   token = handleJwt.signToken(userSend);
   funcionLogin()
   // setTimeout(funcionLogin, 1000)
 }

 userController.friends = async (req, res, next) => {
  console.log(req.body)
  const { body: { phone, lastFriends }} = req
  // lastFriends
  let coords=[]
  const valoresSeparados = lastFriends.split(',').map((valor) => valor.trim());
  // Ahora, valoresSeparados contendrá un array de valores limpios
  console.log(valoresSeparados);
  const t = await db.sequelize.transaction();
  try {
    db.User.findAll({
      where: {
        phone: {
          [Op.in]: valoresSeparados,
        },
      },
      limit: 10, // Limitar a 10 resultados
    }, { transaction: t }).then((items) => {
      let coordTemp= []
      console.log("NUMERO DE AMIGOS: ",items.length)
      items.forEach((item) => {
        console.log('Phone:', item.phone);
        console.log('Last Location:', item.lastLocation);
        console.log('Coordenadas:', item.lastLocation.coordinates);
        console.log('Last Friends:', item.lastFriends);
        coordTemp.push({ phone: item.phone, nombre: item.nombre, coord: [item.lastLocation.coordinates[0], item.lastLocation.coordinates[1]]})
      });
      if (!coordTemp) {
        res.status(400).send({
          message: "Content empty!"
        });
      } else {
        t.commit();
        res.status(200).send({
          status: true,
          listFriends: coordTemp,
          message: "Estos son los amigos!"
        });
      }
    }).catch((error) => {
      console.error('Error:', error);
    });
  } catch (e) {
    await t.rollback();
    console.log(`Error in seeding database with datos: ${e}`);
  }
 }
userController.put = async (req, res, next) => {
  res.send('respond with a resource put');
  console.log("userController: ")
}
userController.delete = async (req, res, next) => {
  res.send('respond with a resource delete');
  console.log("userController: ")
}
userController.bulkInsert = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    // Verify that database connection is valid
    await db.sequelize.authenticate();

    // Create database tables based on the models we've defined
    // Drops existing tables if there are any
    // await sequelize.sync({ force: true });

    // Creates course records in bulk from our JSON-array
    // await db.User.bulkCreate(JSON.parse(datos.replace(/[\r]?[\n]/g, '\\n')));
    // await db.User.bulkCreate(JSON.parse(datos.datos.toString()))
    let infoAInsertar = datos.datos.map((item) => {
      item.password = bcrypt.hashSync(item.password, 10);
      return item
    })
    // datos.datos.password = bcrypt.hashSync(datos.datos.password, 10);
    const bulkDatos=await db.User.bulkCreate(infoAInsertar, { transaction: t })
    // console.log(datos.datos)
    // res.json(datos.datos)
    let trackAInsertar = datos.datos.map((item) => {
      return {location: item.lastLocation, phonetrack: item.phone}
    })
    console.log(trackAInsertar)
    if(bulkDatos) {
      console.log("Courses created successfully!");
          // await db.Geolocation.create({ location: infoAInsertar.lastLocation, phonetrack: infoAInsertar.phone }, { transaction: t });
      await db.Geolocation.bulkCreate(trackAInsertar, { transaction: t });
      await t.commit();
      res.status(201).send({
        success: true,
        message: "users successfully created",
        users: datos.datos
      });
    }
    
  } catch(e) {
    await t.rollback();
    console.log(`Error in seeding database with datos: ${e}`);
  }
}
  /*
   try {
     user = await db.User.findOne({ where: { phone, password } });
     console.log("user: " + user);
     // const resultado = bcrypt.compareSync(password, user.password);
     if(user) {
       // user.set("password", undefined, { strict: false });
       console.log("USER login: " + JSON.stringify(user.dataValues))
       let userSend = {
         lastFriends: user.dataValues.lastFriends,
         lastLocation: user.dataValues.lastLocation,
         nombre: user.dataValues.nombre,
         phone: user.dataValues.phone
       }
       token = handleJwt.signToken(userSend);
       funcionLogin()
     } else {
       res.status(401).send({
         success: false,
         message: "there was a problem searching the user"
       });
     }
   } catch(e) {
     console.log("ERROR: " + JSON.stringify(e))
     res.status(401).send({
       success: false,
       message: "there was a problem decoding the token"
     });
   }
   */

export default userController;