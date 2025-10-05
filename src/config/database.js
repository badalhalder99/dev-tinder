const mongoose = require("mongoose")
require("dotenv").config()

const monogo_uri = process.env.MONGODB_URI

const connectDB = async () => {
   await mongoose.connect(monogo_uri)
}

module.exports = {
   connectDB
}

