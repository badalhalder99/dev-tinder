const express = require("express")
const profileRouter = express.Router()
const { userAuth } = require('../middleware/auth')

//Profile API:
profileRouter.get("/profile", userAuth, async (req, res) => {
   try {

      const user = req.user

      res.send(user)
   } catch (err) {
      res.status(500).send(`Error saving the user: ${err.message}`);
   }
})

module.exports = profileRouter;