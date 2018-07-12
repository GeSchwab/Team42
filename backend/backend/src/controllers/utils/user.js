const UserModel = require('../../models/user')
const WantsModel = require('../../models/wants')
const OffersModel = require('../../models/offers')
const config = require('../../config')

const obfuscatePassword = (user) => Object.assign(user,{password: ''})

const getUserInfo = (query,res) => {
  UserModel.findOne(query)
          .populate('wants')
          .populate('offers')
          .exec()
          .then(user => {
            if(!user) {
              res.status(404).json({
                error: "User Not Found",
              })
            } else {
              res.status(200).json(
                obfuscatePassword(user)
              )
            }
          })
          .catch(e => res.status(404).json({
            error: 'Unknown error',
            message: e.message
          }))
}

const deleteUser=(query,res)=>{
    UserModel.findByIdAndRemove(req.params._id).exec()
        .then(() => res.status(200).json({message: `User with id${req.params.id} was deleted`}))
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));

}

const getUserWants = (query,res) => {
  UserModel.findOne(query)
    .populate('wants')
    .select('wants')
    .exec()
    .then(wants => {
      if(!wants) {
        res.status(404).json({
          error: "User Not Found",res,
        })
      } else {
        res.status(200).json(wants)
      }
    })
    .catch(e => res.status(404).json({
      error: 'Unknown error',
      message: e.message
    }))
}

const getUserOffers = (query,res) => {
  UserModel.findOne(query)
    .populate('offers')
    .select('offers')
    .exec()
    .then(offers => {
      if(!offers) {
        res.status(404).json({
          error: "User Not Found",
        })
      } else {
        res.status(200).json(offers)
      }
    })
    .catch(e => res.status(404).json({
      error: 'Unknown error',
      message: e.message
    }))
}

const addUserWants = async (userId,wants,res) => {
  try {
    let user = await UserModel
      .findOne({_id: userId})
      .populate('wants')
      .exec()
    if (!user) {
      return res
      .status(404)
      .json(
        {error: "This user does not exist"}
      )
    }
    // premium check
    if(!user.isPremium
      && user.wants
      && user.wants.length + wants.length > config.nonPremiumWantsLimit) {
      return res
      .status(400)
      .json(
        {error: 'User wants limit has been exceed'}
      )
    }
    // inserting wants
    let wantsRef = await Promise.all(
      wants.map(
        want => WantsModel.create(Object.assign({},want,{creator: user._id})
        )
      )
    )

    let result = await user
    .update(
      {
        $push: {
          'wants':{
            '$each':wantsRef.map(want => want._id)
          }
        }
      }
    )
    .exec()
    return res
    .status(200)
    .json(wantsRef)
  }
  catch(e) {
    res
    .status(500)
    .json({error: e.message})
  }

}

const deleteUserWants = async (userId,wants,res) => {
  try {
    let user = await UserModel
      .findOne({_id: userId})
      .populate('wants')
      .exec()
    if (!user) {
      return res
      .status(404)
      .json({error: "This user does not exist"})
    }
    // inserting wants
    let wantsRef = await Promise.all(
      wants.map(
        want => WantsModel.deleteOne({_id: want._id})
      )
    )
    console.log("Ergebnis")
    console.log(userId)
    console.log(wants.map(want => want._id))
    let result = await Promise.all(
      wants.map(
        want => this.xyz(user,userId,want._id)
      )
    )
    return res
    .status(200)
    .json(wantsRef)
  }
  catch(e) {
    res
    .status(500)
    .json({error: e.message})
  }
}

const xyz = async (o,a,b) => {
  console.log(a)
  console.log(b)
  let x = o.findOneAndUpdate({a}, {$pull: {'wants': {_id: b}}})
  console.log(x)
}

const addUserOffers = async (userId,offers,res) => {
  try {
    let user = await UserModel
      .findOne({_id: userId})
      .populate('offers')
      .exec()
    if(!user) {
      return res.status(404).json({
        error: "This user does not exist"
      })
    }
    if(!user.isPremium
      && user.offers
      && user.offers.length + offers.length > config.nonPremiumWantsLimit)
    {
      return res.status(400).json({
        error: 'User offers limit has been exceed'
      })
    }

    let offersRef = await Promise.all(
      offers.map(offer =>
        OffersModel.create(
          Object.assign({},offer,{creator:user._id})
        )
      )
    )
    let result = await user.update(
      {
        $push: {
          'offers':{
            '$each':offersRef.map(offer => offer._id)
          }
        }
      }
    ).exec()
    return res.status(200).json(offersRef)
  }catch(e) {
    res.status(500).json({
      error: e.message
    })
  }
}

const deleteUserOffers = async (userId,offers,res) => {
  try {
    let user = await UserModel
      .findOne({_id: userId})
      .populate('offers')
      .exec()
    if (!user) {
      return res
      .status(404)
      .json({error: "This user does not exist"})
    }
    // inserting offers
    let offersRef = await Promise.all(
      offers.map(
        offer => OffersModel.deleteOne({_id: offer._id})
      )
    )
    Favorite.update( {cn: req.params.name}, { $pullAll: {uid: [req.params.deleteUid] } } )
    let result = await Promise.all(
      offers.map(
        offer => user.findOneAndUpdate(
          {userId}, {$pull: {offers: {_id: offer._id}}}
        )
      )
    )
    return res
    .status(200)
    .json(offersRef)
  }
  catch(e) {
    res
    .status(500)
    .json({error: e.message})
  }
}

const userToPremium = async (userId,res) => {
  try {
    let result = await UserModel.update({_id: userId},{isPremium: true}).exec()
    res.status(200).json(result)
  } catch(e) {
    res.status(500).json({
      error: e.message
    })
  }
}
module.exports = {
  getUserInfo,
  getUserWants,
  getUserOffers,

  addUserWants,
  deleteUserWants,
  addUserOffers,
  deleteUserOffers,

  userToPremium,
  deleteUser,
}
