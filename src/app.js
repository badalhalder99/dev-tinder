const express = require("express")
require("dotenv").config()
const { connectDB } = require("./config/database")

const app = express()
const PORT = process.env.PORT || 3000

connectDB().then(() => {
   console.log("Database connected successfully!")
   app.listen(PORT, () => {
      console.log(`Server is successfully running on ${PORT}`)
   })
}).catch(err => {
   console.error("Database can not be connected!")
})

