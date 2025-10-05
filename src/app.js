const express = require("express")
require("dotenv").config()
const { connectDB } = require("./config/database")
const { validateSignupData } = require("./utils/validate")
const { User } = require("./models/user")
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const { userAuth } = require('./middleware/auth')
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
         const token = await jwt.sign({ _id: existingUser._id }, "DEV@Tinder$123", { expiresIn: '7d' })

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
app.get("/profile", userAuth, async (req, res) => {
   try {

      const user = req.user

      res.send(user)
   } catch (err) {
      res.status(500).send(`Error saving the user: ${err.message}`);
   }
})

//sendConnectionRequest API:
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
   try {
      const user = req.user
      res.send(user.firstName + " Sent Connection Request successfully!")
   } catch (err) {
      res.status(500).send(`Error saving the user: ${err.message}`);
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

