const adminAuth = (req, res, next) => {
  console.log("Admin auth is getting checked")
  const token = "xyz"

  const isAuthenticated = token === "xyz"

  if(!isAuthenticated) {
    res.status(401).send("Unauthorized admin data")
  } else {
    next()
  }
}

const userAuth = (req, res, next) => {
  console.log("user auth is getting checked")
  const token = "xyz"

  const isAuthenticated = token === "xyz"

  if(!isAuthenticated) {
    res.status(401).send("Unauthorized user data")
  } else {
    next()
  }
}

module.exports = { adminAuth, userAuth }
