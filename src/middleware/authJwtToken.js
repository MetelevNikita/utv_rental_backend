const jwt = require('jsonwebtoken')
const path = require('path')
const dotenv = require('dotenv').config({
  path: path.resolve(process.cwd(), '.env')
});


console.log(process.env.SECRET_KEY)



const authJwtToken = (req, res, next) => {

  try {

    const token = req.cookies.token
    if(!token) {
      res.redirect('/admin/login')
      return
    }
    const user = jwt.verify(token , process.env.SECRET_KEY)

    if(!user) {
      res.redirect('/admin/login')
      return
    }
    next()
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.redirect('/admin/login')
    }
  }

}

module.exports  =  authJwtToken