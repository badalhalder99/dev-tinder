const mongoose = require("mongoose")
const { Schema } = mongoose;
const validator = require('validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new Schema({
   firstName: {
      type: String,
      required: true,
      index: true
   },
   lastName: {
      type: String
   },
   emailId: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      validate (value) {
         if (!validator.isEmail(value)) {
            throw new Error("Email is not valid!")
         }
      }
   },
   password: {
      type: String,
      required: true,
      validate (value) {
         if (!validator.isStrongPassword(value)) {
            throw new Error("Password is not valid!")
         }
      }
   },
   age: {
      type: Number,
      min: 18
   },
   gender: {
      type: String,
      enum: {
         values: ['male', 'female', 'others'],
         message: `{VALUE} is incorrect gender type!`
      }

      //custom validate funciton
      // validate(value) {
      //    if (!["male", "female", "others"].includes(value)) {
      //       throw new Error("Gender data is not valid!")
      //    }
      // }
   },
   photoUrl: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/512/219/219983.png',
      validate (value) {
         if (!validator.isURL(value)) {
            throw new Error("PhotoURL is not valid!")
         }
      }
   },
   about: {
      type: String,
      default: "This is default description of about"
   },
   skills: {
      type: [String]
   }
}, { timestamps: true })

userSchema.index({ firstName: 1 })

userSchema.methods.getJWT = async function () {
   const existingUser = this

   const token = await jwt.sign({ _id: existingUser._id }, "DEV@Tinder$123", { expiresIn: '7d' })
   return token;
}

const User = mongoose.model("User", userSchema)

module.exports = {
   User,
}
