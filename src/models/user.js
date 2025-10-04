const mongoose = require("mongoose")
const { Schema } = mongoose;

const userSchema = new Schema({
   firstName: {
      type: String,
      required: true
   },
   lastName: {
      type: String
   },
   emailId: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
   },
   password: {
      type: String
   },
   age: {
      type: Number,
      min: 18
   },
   gender: {
      type: String,
      validate(value) {
         if (!["male", "female", "others"].includes(value)) {
            throw new Error("Gender data is not valid!")
         }
      }
   },
   photoUrl: {
      type: String
   },
   about: {
      type: String,
      default: "This is default description of about"
   },
   skills: {
      type: [String]
   }
}, { timestamps: true })

const User = mongoose.model("User", userSchema)

module.exports = {
   User,
}
