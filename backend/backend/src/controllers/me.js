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

/* old one, not working on PC
const addWants = (req,res) => {
  let userId = req.userId
  let parseWant = (want) => {
    let fields = "name descriptions category images".split(' ')
    if(fields.some(field => Object.keys(want).indexOf(field) == -1)) {
      return res.status(400).json({
        error: `missing: ${attr}`
      })
    }
    return {name:want.name,descriptions:want.descriptions,category:want.category,images:want.images}
  }
  if (Array.isArray(req.body)) {
    let wants = req.body.map(parseWant)
    console.log(wants)
    userUtils.addWants(userId,wants,res)
  } else {
    let wants = parseWant(req.body)
    console.log(wants)
    userUtils.addWants(userId,[wants],res)
  }
}*/


const addWants = (req,res) => {
    let userId = req.userId
    //retrieve all infos
    let parseWant = (want) => {
        let wants = {}
        let fields = "name descriptions category".split(' ')

        for (let i in fields) {
            let attr = fields[i]
            if (!want[attr]) return res.status(400).json({
                error: `missing required field ${attr}`
            })
            // assign it to the offer obj.
            wants[attr] = want[attr]
        }


        return wants
    }

    if (Array.isArray(req.body)) {
        let wants = req.body.map(parseWant)
        userUtils.addWants(userId, wants, res)
    } else {
        userUtils.addWants(userId, [req.body], res)
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
    userUtils.addOffers(userId,offers,res)
  } else {
    userUtils.addOffers(userId,[req.body],res)
  }

}
const toPremium = (req,res) => {
  let userId = req.userId
  userUtils.toPremium(userId,res)
}
module.exports = {
  info,
  wants,
  offers,

  addWants,
  addOffers,

  toPremium
}
