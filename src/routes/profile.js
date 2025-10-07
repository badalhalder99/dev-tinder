const express = require("express")
const profileRouter = express.Router()
const validator = require('validator');
const { userAuth } = require('../middleware/auth')
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const { validateProfileEditData } = require("../utils/validate")

//Profile view API:
profileRouter.get("/profile/view", userAuth, async (req, res) => {
   try {

      const user = req.user

      res.send(user)
   } catch (err) {
      res.status(500).send(`Error saving the user: ${err.message}`);
   }
})

//Profile edit API:
profileRouter.put("/profile/edit", userAuth, async (req, res) => {
   try {

      const isEditSuccessed = validateProfileEditData(req)

      if (!isEditSuccessed) {
         throw new Error("Invalid edit request!")
      }

      const loggedInUser = req.user;

      //Object.keys(req.body).forEach(k => loggedInUser[k] = req.body[k])
      Object.assign(loggedInUser, req.body); // you can use line number 30 code.Because 30 or 31 line code is same
      await loggedInUser.save();

      res.json({
         code: 200,
         message:`${loggedInUser.firstName}, Your profile edited successfully!`,
         data: loggedInUser
      })
   } catch (err) {
      res.status(500).send(`Error saving the user: ${err.message}`);
   }
})

// Forget Password API:
profileRouter.post("/forgot-password", async (req, res) => {
   try {
      const { emailId, newPassword } = req.body;

      // Step 1: Check if both fields are provided
      if (!emailId || !newPassword) {
         throw new Error("Email and new password are required!");
      }

      // Step 2: Check if user exists
      const user = await User.findOne({ emailId });
      if (!user) {
         throw new Error("User not found with this email!");
      }

      // Step 3: Validate new password strength
      if (!validator.isStrongPassword(newPassword)) {
         throw new Error("Please enter a strong password!");
      }

      // Step 4: Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Step 5: Replace the old password with the new one In DB
      user.password = hashedPassword;

      // Step 6: Save updated user to database
      await user.save();

      // Step 7: Send success response
      res.json({
         code: 200,
         message: "Password reset successful! You can now log in with your new password.",
      });
   } catch (err) {
      res.status(500).send(`Error resetting password: ${err.message}`);
   }
});

module.exports = profileRouter;