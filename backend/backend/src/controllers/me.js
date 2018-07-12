// controller for giving / editing info about this user
const config    = require('../config')
const UserModel = require('../models/user')
const userUtils = require('./utils/user')
const info = (req,res) => {
  let userId = req.userId
  userUtils.getUserInfo({_id: userId},res)
}

const wants = (req,res) => {
  let userId = req.userId
  userUtils.getUserWants({_id: userId},res)
}
const offers = (req,res) => {
  let userId = req.userId
  userUtils.getUserOffers({_id: userId},res)
}

const addWants = (req,res) => {
    let userId = req.userId
    //retrieve all infos
    let parseWant = (want) => {
      let wants = {}
      let fields = "name descriptions category".split(' ')
      for (let i in fields) {
        let attr = fields[i]
        if (!want[attr]) {
          return res
          .status(400)
          .json(
            {error: `missing required field ${attr}`}
          )

        }
        // assign it to the offer obj.
        wants[attr] = want[attr]
      }
      return wants
    }
    if (Array.isArray(req.body)) {
      let wants = req.body.map(parseWant)
      userUtils.addUserWants(userId, wants, res)
    }
    else {
      userUtils.addUserWants(userId, [req.body], res)
    }
}
const deleteWants = (req,res) => {
  let userId = req.userId
  let parseWant = (want) => {
    let wants = {}
    let fields = "name descriptions category".split(' ')
    for (let i in fields) {
      let attr = fields[i]
      if (!want[attr]) {
        return res
        .status(400)
        .json(
          {error: `missing required field ${attr}`}
        )

      }
      // assign it to the offer obj.
      wants[attr] = want[attr]
    }
    return wants
  }
  if (Array.isArray(req.body)) {
    let wants = req.body.map(parseWant)
    userUtils.deleteUserWants(userId, wants, res)
  }
  else {
    userUtils.deleteUserWants(userId, [req.body], res)
  }
}

const addOffers = (req,res) => {
  let userId = req.userId
  //retrieve all infos
  let parseOffer = (offer) => {
    let offers = {}
    let mandatoryField = "name descriptions amount".split(' ')
    //let optionalField = "price wants images amount".split(' ')
    let optionalField = "price wants amount".split(' ')
    for(let i in mandatoryField) {
      let attr = mandatoryField[i]
      if(!offer[attr]) return res.status(400).json({
        error:`missing required field ${attr}`
      })
      // assign it to the offer obj.
      offers[attr] = offer[attr]
    }
    // TODO: add type check here
    for(let i in optionalField) {
      let attr = optionalField[i]
      if(offer[attr]) {
        offers[attr] = offer[attr]
      }
    }
    offers["isInfinite"] = false
    return offers
  }
  if(Array.isArray(req.body)) {
    let offers = req.body.map(parseOffer)
    userUtils.addUserOffers(userId,offers,res)
  } else {
    userUtils.addUserOffers(userId,[req.body],res)
  }
}
const deleteOffers = (req,res) => {
  let userId = req.userId
  let parseOffer = (offer) => {
    let offers = {}
    let mandatoryField = "name descriptions amount".split(' ')
    //let optionalField = "price offers images amount".split(' ')
    let optionalField = "price offers amount".split(' ')
    for(let i in mandatoryField) {
      let attr = mandatoryField[i]
      if(!offer[attr]) return res.status(400).json({
        error:`missing required field ${attr}`
      })
      // assign it to the offer obj.
      offers[attr] = offer[attr]
    }
    // TODO: add type check here
    for(let i in optionalField) {
      let attr = optionalField[i]
      if(offer[attr]) {
        offers[attr] = offer[attr]
      }
    }
    offers["isInfinite"] = false
    return offers
  }
  if (Array.isArray(req.body)) {
    let offers = req.body.map(parseOffer)
    userUtils.deleteUserOffers(userId, offers, res)
  }
  else {
    userUtils.deleteUserOffers(userId, [req.body], res)
  }
}

const toPremium = (req,res) => {
  let userId = req.userId
  userUtils.userToPremium(userId,res)
}

module.exports = {
  info,
  wants,
  offers,

  addWants,
  deleteWants,
  addOffers,
  deleteOffers,

  toPremium
}
