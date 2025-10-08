const mongoose = require("mongoose")
const { Schema, model } = mongoose;

const connectionRequestSchema = new Schema({

   fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //refference to the User collection
      required: true
   },
   toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true
   },
   status: {
      type: String,
      required: true,
      enum: {
         values: ['ignored', 'interested', 'accepted', 'rejected'],
         message: `{VALUE} is incorrect status type`
      }
   }
}, { timestamps: true })

//ConnectionRequest.find({fromUserId: 61656646464644454656646})
connectionRequestSchema.index({fromUserId: 1, toUserId: 1})

connectionRequestSchema.pre("save", function (next) {
   const connectionRequest = this

   //Check if the fromUserId is same as toUserId
   if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
      throw new Error("Cannot send connection request to yourself!")
   }
   next()
})

const ConnectionRequestModel = new model("connectionRequest", connectionRequestSchema)

module.exports = {
   ConnectionRequestModel
}
