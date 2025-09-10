const Pool = require('../database/db')
const jwt = require('jsonwebtoken')
const path = require('path')
const dotenv = require('dotenv').config({
  path: path.resolve(process.cwd(), '.env'),
})

console.log(process.env.SECRET_KEY)


const postLogin = async (req, res) => {

  try {

    const {email, password}  =  req.body;

    console.log(req.body)

    if (!email || !password)   {
      res.status(400).send({message: 'поля не заполнены'})
      return
    }

    const confirmLogin = await Pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password])

    if (!confirmLogin.rows)  {
      res.status(401).send({message: 'Неверный email или пароль'})
      return
    }

    console.log(confirmLogin.rows[0])

    const token  = jwt.sign({email: confirmLogin.rows[0].email}, process.env.SECRET_KEY, {expiresIn: '1h'})
    console.log(token)
    res.cookie('token', token)
    res.redirect('/create')



  } catch (error) {
    console.log(error)
    res.status(500).send({message: `Что то пошло не так ${error}`})
  }
}

module.exports = postLogin