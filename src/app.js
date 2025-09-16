const express = require("express")
require("dotenv").config();
const { adminAuth, userAuth } = require("./middleware/auth")

const app = express()
const PORT = process.env.PORT || 3000

app.use("/admin", adminAuth)

app.get("/user", userAuth, (req, res) => {
  res.send("user data get successfully")
})

app.get("/admin/getAllData", (req, res) => {
  res.send("All data get successfully!")
})

app.get("/admin/deleteUser", (req, res) => {
  res.send("admin Data deleted successfully!")
})

// app.get("/admin/getAllData", (req, res) => {
//   const token = "xyz";
//   const isAdminAuthorized = token === "xyz";
//   if (isAdminAuthorized) {
//     res.send("All Data Sent");
//   } else {
//     res.status(401).send("Unauthorized request");
//   }
// });


app.listen(PORT, () => {
  console.log(`Server is successfully running on ${PORT}`)
})

//end of the file.Do next..