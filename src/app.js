const express = require("express")
require("dotenv").config()
const { connectDB } = require("./config/database")
const { validateSignupData } = require("./utils/validate")
const { User } = require("./models/user")
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json());
app.use(cookieParser());

//Signup API - post new users registered data into the database:
app.post("/signup", async (req, res) => {
   try {
      //Validation of Data:
      validateSignupData(req)

      //Encrypt the password:
      const { password } = req.body
      const passwordHash = await bcrypt.hash(password, 10)

      // Destructure all required fields from request body
      const { firstName, lastName, emailId, gender, age, skills, about, photoUrl } = req.body;

      const newUser = {
         firstName,
         lastName,
         emailId,
         password: passwordHash,
         gender,
         age,
         skills,
         about,
         photoUrl
      }

      //Check if user already exists
      const existingUser = await User.findOne({ emailId });
      if (existingUser) {
         return res.status(400).send("Email already registered");
      }

      //creating a new instance of the user model
      const user = new User(newUser)

      await user.save()
      res.send("User added successfully!")
   } catch (err) {
      res.status(500).send(`Error saving the user: ${err.message}`);
   }
})

//Login API - Login new users:
app.post("/login", async (req, res) => {
   try {
      const { emailId, password } = req.body

      // Check if user already exists
      const existingUser = await User.findOne({ emailId: emailId.toLowerCase() });
      if (!existingUser) {
         return res.status(404).send("User not found!");
      }

      const isPasswordValid = await bcrypt.compare(password, existingUser.password)

      if (isPasswordValid) {
         //Create a JWT Token:
         const token = await jwt.sign({ _id: existingUser._id }, "DEV@Tinder$123")

         console.log(token)
         //Add the token to the cookie and send the response back to the user
         res.cookie("token", token)
         res.send("User logged in successfully!")
      } else {
         throw new Error ("Password is not correct!")
      }

   } catch (err) {
      res.status(500).send(`Error saving the user: ${err.message}`);
   }
})

//Profile API:
app.get("/profile", async (req, res) => {
   try {
      const cookies = req.cookies
      const { token } = cookies

      if (!token) {
         throw new Error("Invalid tokens!")
      }

      //validate my token:
      const decodedMessage = await jwt.verify(token, "DEV@Tinder$123")
      
      const { _id } = decodedMessage
      console.log(`Loged in user id is: ${_id}`)

      console.log(decodedMessage)

      const user = await User.findById(_id)
      if (!user) {
         throw new Error("User not found!")
      }

      res.send(user)
   } catch (err) {
      res.status(500).send(`Error saving the user: ${err.message}`);
   }
})

//Update profile API/ Update the data to the database:
app.put("/user/:id", async (req, res) => {

   const userId = req.params.id
   const updateUserData = req.body

   console.log(req.params)

   try {
      const allowedUpdate = ["_id", "photoUrl", "about", "gender", "age", "skills"]

      const isUpdateAllowed = Object.keys(updateUserData).every(k => allowedUpdate.includes(k))

      if (!isUpdateAllowed) {
         res.status(400).send("Update not allowed!")
      }

      if (updateUserData?.skills.length > 5) {
         throw new Error("Skills cannot be more than 5")
      }

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

