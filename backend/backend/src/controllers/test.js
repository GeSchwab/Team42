const jwt        = require('jsonwebtoken');
const bcrypt     = require('bcryptjs');

const config     = require('../config');
const UserModel  = require('../models/user')
const WantModel = require('../models/wants')
const OfferModel = require('../models/offers')

const testRegister = async (req,res) => {
  try {
    let want = await WantModel.create({
      name: "A new want",
      descriptions: "which is nothing",
    })
    let want_id = want._id
    let numUser = await UserModel.count({username: 'testac'})
    if(numUser != 0) {
      res.status(400).json({
        error: 'user already registered'
      })
      return
    }
    let user = await UserModel.create({
      username: 'testac',
      password: '12345',
      gender: 'M',
      isPremium: 'false',
      dob: new Date('1/1/1994'),
      picturePath: 'http://www.sunny-beats.de/download/Testbild.jpg',
      wants: [want_id],
    })
    const token = jwt.sign({ id: user._id, username: user.username }, config.JwtSecret, {
        expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).json({
      token,
    })
  }catch(e) {
    res.status(500).json({
      'error': e.message
    })
  }


}
const testPopulate = async (req,res) => {
  try {
    let username = 'testac'
    let user = await UserModel.findOne({username}).populate('wants')
    res.status(200).json(user)
  }catch(e) {
    res.status(500).json({
      'error': e.message
    })
  }
}
module.exports = {
  testRegister,
  testPopulate,
}
