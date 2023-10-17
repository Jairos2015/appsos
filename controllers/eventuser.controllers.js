import {db} from '../models/index.js'
import bcrypt from 'bcrypt'
import userMiddleware from '../middlewares/middleware.js'

import {handleJwt} from '../middlewares/handleJwt.js'
///
console.log(db.db)
const userController = {}
const eventuserController = {}
eventuserController.get = async (req, res, next) => {


}
userController.post = async (req, res, next) => {

}
eventuserController.listmyfriends = async (req, res, next) => {
  const { body: { phone, lastLocation, lastFriends  }, } = req;
  try {
    const t = await db.sequelize.transaction();
    const eventOfUser = await db.EventUser.create({  eventName, estado, tipo, phoneEvent, activa, comments, lastLocation }, { transaction: t });
    await t.commit();
  } catch (e) {
    await t.rollback();
    console.log(`Error in seeding database with datos: ${e}`);
  }
}