const express = require("express")
const userRouter = express.Router()
const { User } = require("../models/user")
const { userAuth } = require('../middleware/auth')
const { ConnectionRequestModel } = require("../models/connectionRequest")

//get all the pending connect request for the loggedin user API:
userRouter.get("/user/requests/pending", userAuth,  async (req, res) => {
   try {
      const loggedInUser = req.user

      const connectionRequests = await ConnectionRequestModel.find({
         toUserId: loggedInUser._id,
         status: "interested",
      }).populate("fromUserId", ["firstName", "lastName", "photoUrl"])

      if (!connectionRequests || connectionRequests.length === 0) {
         return res.status(404).json({
            message: `pending Request Not Found!`
         });
      }

      res.json({
         message: `Data get Successfully!`,
         data: connectionRequests
      });
   } catch (err) {
      res.status(500).send(`Error: ${err.message}`);
   }
})

//get all connected profile with my profile API:
userRouter.get("/user/connections", userAuth,  async (req, res) => {
   try {
      const loggedInUser = req.user

      // find all ConnectionRequest:
      const connectionRequests = await ConnectionRequestModel.find({
         $or: [
            { toUserId: loggedInUser._id, status: "accepted" },
            { fromUserId: loggedInUser._id, status: "accepted" },
         ]
      })
      .populate("fromUserId", ["firstName", "lastName", "photoUrl"])
      .populate("toUserId", ["firstName", "lastName", "photoUrl"])

      if (!connectionRequests) {
         return res.status(404).json({
            message: `Connection Not Found!`
         });
      }

      const data = connectionRequests.map(row => {
         if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
            return row.toUserId
         }
         return row.fromUserId
      })

      res.json({
         message: `Data get Successfully!`,
         data: data
      });
   } catch (err) {
      res.status(500).send(`Error: ${err.message}`);
   }
})

//get all user API:
userRouter.get("/feed", userAuth,  async (req, res) => {
   try {

      //User should see all the user card except
      //0.his own card
      //1. his connections
      //2. ignored people
      //3. already sent the connection request

      const loggedInUser = req.user

      const page = parseInt(req.query.page || 1)
      let limit = parseInt(req.query.limit || 10)
      limit = limit > 50 ? 50 : limit

      const skip = (page -1) * limit

      //Find all connection requests (sent + received)
      const connectionRequests = await ConnectionRequestModel.find({
         $or: [
            { fromUserId: loggedInUser._id},
            { toUserId: loggedInUser._id}
         ]
      }).select("fromUserId toUserId")

      const hideUsersFromFeed = new Set()

      connectionRequests.forEach(req => {
         hideUsersFromFeed.add(req.fromUserId.toString())
         hideUsersFromFeed.add(req.toUserId.toString())
      })

      const users = await User.find({
         $and: [
            { _id: { $nin: Array.from(hideUsersFromFeed) } },
            { _id: { $ne: loggedInUser._id } },
         ]
      }).select("firstName lastName photoUrl gender age skills about").skip(skip).limit(limit)

      res.send(users)

   } catch (err) {
      res.status(500).send(`Error: ${err.message}`);
   }
})

//get all user API:
// userRouter.get("/feed", async (req, res) => {
//    try {

//       const user = await User.find({})
//       res.send(user)
//    } catch (err) {
//       res.status(500).send(`Error saving the user: ${err.message}`);
//    }
// })

module.exports = userRouter;
