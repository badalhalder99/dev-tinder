const express = require("express")
const mongoose = require("mongoose");
const requestRouter = express.Router()
const { userAuth } = require('../middleware/auth')
const { User } = require("../models/user")
const { ConnectionRequestModel } = require("../models/connectionRequest")

//sendConnectionRequest API:
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
   try {

      const fromUserId = req.user._id
      const toUserId = req.params.toUserId
      const status = req.params.status

      const allowedStatus = ["ignored", "interested"]

      if (!allowedStatus.includes(status)) {
         return res.status(400).json({
            message: `Invalid status type ${status}`
         })
      }

      // Validate ObjectId before querying:
      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
         return res.status(400).json({ message: "Invalid user ID format" });
      }

      // If there is an existing User or Not:
      const toUser = await User.findById(toUserId)
      if (!toUser) {
         return res.status(404).json({
            message: `User Not Found!`
         });
      }

      // If there is an existing ConnectionRequest:
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
         $or: [
            {
               fromUserId,
               toUserId
            },
            {
               fromUserId: toUserId,
               toUserId: fromUserId
            }
         ]
      })

      if (existingConnectionRequest) {
         return res.status(500).json({
            message: `Connection request already exists!`
         });
      }

      const connectionRequest = new ConnectionRequestModel({
         fromUserId,
         toUserId,
         status
      })

      const data = await connectionRequest.save()

      res.json({
         message: `${req.user.firstName} ${req.user.lastName} is ${status} in ${toUser.firstName} ${toUser.lastName}`,
         data
      })
   } catch (err) {
      res.status(500).send(`Error: ${err.message}`);
   }
})

// request review API:
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
   try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
         return res.status(400).json({
            message: `Invalid status type ${status}`
         });
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
         _id: requestId,
         toUserId: loggedInUser._id,
         status: "interested",
      });

      if (!connectionRequest) {
         return res.status(404).json({
            message: `Connection Request Not Found!`
         });
      }

      // Update status
      connectionRequest.status = status;
      const data = await connectionRequest.save();

      // Fetch both users for message clarity
      const fromUser = await User.findById(connectionRequest.fromUserId);
      const toUser = await User.findById(connectionRequest.toUserId);

      res.json({
         message: `${toUser.firstName} ${toUser.lastName} has ${status} ${fromUser.firstName} ${fromUser.lastName}`,
         data
      });

   } catch (err) {
      res.status(500).send(`Error: ${err.message}`);
   }
});


module.exports = requestRouter;
