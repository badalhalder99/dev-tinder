const express = require("express")
require("dotenv").config()
const { connectDB } = require("./config/database")
const { User } = require("./models/user")
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json());

//Signup API - post new users registered data into the database:
app.post("/signup", async (req, res) => {

   const newUser = req.body
   //creating a new instance of the user model
   const user = new User(newUser)

   try {
      await user.save()
      res.send("User added successfully!")
   } catch (err) {
      res.status(500).send(`Error saving the user: ${err.message}`);
   }
})

//Update profile API/ Update the data to the database:
app.put("/user", async (req, res) => {

   const userId = req.body._id
   const updateUserData = req.body

   try {
      await User.findByIdAndUpdate({_id: userId}, updateUserData)
      // await User.findByIdAndUpdate(userId, updateUserData)
      res.send("User updated successfully!")
   } catch (err) {
      res.status(400).send(`Error updated the user ${err.message}`)
   }
})

//Get user by email:
app.get("/user", async (req, res) => {
   const userEmail = req.body.emailId

   try {
      const user = await User.find({ emailId: userEmail })
      if (user.length === 0) {
         res.status(404).send("User not Found");
      } else {
         res.send(user)
      }

   } catch (err) {
      res.status(400).send("Something went wrong!")
   }
})

//Feed API - Get /feed - get all the users from the database:
app.get("/feed", async (req, res) => {

   try {
      const users = await User.find({})
      if (users.length === 0) return res.status(404).send("User not Found");
      res.send(users)
   } catch (err) {
      res.status(400).send("Something went wrong!")
   }
})

//Delete API:
app.delete("/user", async (req, res) => {
   const userId = req.body._id

   try {
      await User.findByIdAndDelete({_id: userId})
      // const users = await User.findByIdAndDelete(userId)
      res.send("Users Deleted successfully!")
   } catch (err) {
      res.status(400).send("Something went wrong!")
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

