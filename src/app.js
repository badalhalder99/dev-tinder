const express = require("express")
require("dotenv").config();

const app = express()
const PORT = process.env.PORT || 3000

app.get("/user", (req, res) => {
  res.send({firstname: "Badal", lastname: "Halder"})
})

app.post("/user", (req, res) => {
  res.send("Data save successfully to the database!")
})

app.put("/user", (req, res) => {
  res.send("Data edited successfully!")
})

app.delete("/user", (req, res) => {
  res.send("Data deleted successfully!")
})

// this will match all the HTTP method API calls to /test
app.use("/test", (req, res) => {
  res.send("Hello from the server!")
})


app.listen(PORT, () => {
  console.log(`Server is successfully running on ${PORT}`)
})

//end of the file.Do next..