import {db} from '../models/index.js'
import userMiddleware from '../middlewares/middleware.js'
import {handleJwt} from '../middlewares/handleJwt.js'
const sequelize = db.Sequelize;
const Op = db.Sequelize.Op;

const trackController = {}
trackController.get = async (req, res, next) => {
  console.log("Dentro getTrack")
  console.log(req.body)
  const { count, rows } = await db.Geolocation.findAndCountAll({
    where: {
      phonetrack: {
        [Op.like]: sequelize.col('phonetrack')
      }
    }
  });
  console.log(count);
  console.log(rows);
  // 
  const tracks = await db.Geolocation.findAll();
  res.status(200).send({
    success: true,
    message: "users successfully retrieved",
    tracks,
  });
}
trackController.getid = async (req, res, next) => {
  
}
//
// router.put('/users/:userId', (req, res) => {
//   const user = getUser(req.params.userId)
//
trackController.update = async (req, res, next) => {
    // search for user that is offline
    // assign the booker id to the
    const {
      body: { location, socketID, phonetrack },
    } = req;
    try {
      await db.Geolocation.update(
        {
          socketID: socketID,
          trackerID: userVerify.id,
          location: {
            type: "Point",
            coordinates: [location.longitude, location.latitude],
          },
          online: true,
        },
        { where: { phonetrack: phonetrack }, returning: true }
      )
      return res.status(200).send({
        success: true,
        message: "You have successfully been update atrack",
      });
    } catch (e) {
      return res.status(404).send({
        success: false,
        message: e
      });
    }
}

trackController.post = async (req, res, next) => {
  await db.Geolocation.create({ location: req.body.location, phonetrack: req.body.phonetrack });
  res.status(201).send({
    success: true,
    message: "user successfully created"
  });
}

export default trackController;