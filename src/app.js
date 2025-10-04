const express = require("express")
require("dotenv").config()
const { connectDB } = require("./config/database")
const { validateSignupData } = require("./utils/validate")
const { User } = require("./models/user")
const bcrypt = require('bcrypt')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json());

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
         res.send("User logged in successfully!")
      } else {
         throw new Error ("Password is not correct!")
      }

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

