const express = require("express")
const authRouter = express.Router()
const { validateSignupData } = require("../utils/validate")
const { User } = require("../models/user")
const bcrypt = require('bcrypt')


//Signup API - post new users registered data into the database:
authRouter.post("/signup", async (req, res) => {
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
authRouter.post("/login", async (req, res) => {
   try {
      const { emailId, password } = req.body

      // Check if user already exists
      const existingUser = await User.findOne({ emailId: emailId.toLowerCase() });

      if (!existingUser) {
         return res.status(404).send("User not found!");
      }

      const isPasswordValid = await bcrypt.compare(password, existingUser.password)

      if (isPasswordValid) {
         const token = await existingUser.getJWT()
         res.cookie("token", token)
         res.send("User logged in successfully!")
      } else {
         throw new Error ("Password is not correct!")
      }

   } catch (err) {
      res.status(500).send(`Error saving the user: ${err.message}`);
   }
})

//Logout API - Logout users:
authRouter.post("/logout", async (req, res) => {
   res.cookie("token", null, {
      expires: new Date(Date.now())
   })
   res.send("Logout Successfully!")
})


module.exports = authRouter;
