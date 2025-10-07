const express = require("express")
const profileRouter = express.Router()
const { userAuth } = require('../middleware/auth')
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

module.exports = profileRouter;