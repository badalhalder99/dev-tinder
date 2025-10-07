const express = require("express")
const userRouter = express.Router()
const { User } = require("../models/user")

//get all user API:
userRouter.get("/feed", async (req, res) => {
   try {

      const user = await User.find({})
      res.send(user)
   } catch (err) {
      res.status(500).send(`Error saving the user: ${err.message}`);
   }
})

module.exports = userRouter;
