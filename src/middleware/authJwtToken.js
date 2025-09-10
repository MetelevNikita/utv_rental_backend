const jwt = require('jsonwebtoken')
const path = require('path')
const dotenv = require('dotenv').config({
  path: path.resolve(process.cwd(), '.env')
});


console.log(process.env.SECRET_KEY)



const authJwtToken = (req, res, next) => {

  const token = req.cookies.token
  if(!token) {
    res.redirect('/login')
    return
  }

  const user = jwt.verify(token , process.env.SECRET_KEY)

  if(!user) {
    res.redirect('/login')
    return
  }

  next()

}

module.exports  =  authJwtToken