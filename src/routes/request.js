const express = require("express")
const requestRouter = express.Router()
const { userAuth } = require('../middleware/auth')

//sendConnectionRequest API:
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
   try {
      const user = req.user
      res.send(user.firstName + " Sent Connection Request successfully!")
   } catch (err) {
      res.status(500).send(`Error saving the user: ${err.message}`);
   }
})

module.exports = requestRouter;
