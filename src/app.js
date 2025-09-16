const express = require("express")
require("dotenv").config()
const { connectDB } = require("./config/database")
const { User } = require("./models/user")
const app = express()
const PORT = process.env.PORT || 3000

app.post("/signup", async (req, res) => {
   const userObj = {
      firstName: "Rudra",
      lastName: "Howlader",
      emailId: "badalchandrahalder99@gmai.com",
      password: "Badal1234"
   }

   //creating a new instance of the user model
   const user = new User(userObj)

   try {
      await user.save()
      res.send("User added successfully!")
   } catch (err) {
      res.status(400).send(`Error saving the user ${err.message}`)
   }
})

connectDB().then(() => {
   console.log("Database connected successfully!")
   app.listen(PORT, () => {
      console.log(`Server is successfully running on ${PORT}`)
   })
}).catch(err => {
   console.error("Database can not be connected!")
})

