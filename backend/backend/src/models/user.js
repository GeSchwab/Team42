"use strict";

const mongoose = require('mongoose');

// Define the user schema

const UserSchema  = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
      type: String,
      enum: ['M','F'],
    },
    isPremium: {
      type: Boolean,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    descriptions: {
      type: String,
      required: false,
    },
    picturePath: {
      type: String,
      required: true,
    },
    wants: [{type:mongoose.Schema.Types.ObjectId,ref: 'Want'}],
    offers: [{type: mongoose.Schema.Types.ObjectId,ref: 'Offer'}],
    groups: [{type: mongoose.Schema.Types.ObjectId,ref: 'Group'}],
});

UserSchema.set('versionKey', false);

// Export the User model
module.exports = mongoose.model('User', UserSchema);
