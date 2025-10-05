const jwt = require("jsonwebtoken")
const { User } = require("../models/user")

const userAuth = async (req, res, next) => {
   try {
      //Read the token from the req cookies:
      const cookies = req.cookies
      const { token } = cookies

      if (!token) {
         throw new Error("Invalid tokens!")
      }

      const decodedObj = await jwt.verify(token, "DEV@Tinder$123")
      const { _id } = decodedObj;

      const user = await User.findById(_id)

      if (!user) {
         throw new Error("User not found!")
      }

      req.user = user;

      next()
   } catch (err) {
      res.status(500).send(`Error saving the user: ${err.message}`);
   }
}

module.exports = { userAuth }
//End of the auth file//