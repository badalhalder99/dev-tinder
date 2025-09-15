const express = require("express")
require("dotenv").config();

const app = express()
const PORT = process.env.PORT || 3000

app.use("/", (req, res) => {
  res.send("Hello to homepage")
})

app.use("/hello", (req, res) => {
  res.send("Hello from the server 2!")
})

app.use("/test", (req, res) => {
  res.send("Hello from the server!")
})

app.listen(PORT, () => {
  console.log(`Server is successfully running on ${PORT}`)
})

//end of the file.Do next.