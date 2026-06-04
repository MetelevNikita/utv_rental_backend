
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const path = require('path')
const dotenv = require('dotenv').config({
  path: path.resolve(process.cwd(), '.env'),
})
const { prisma } = require('../../lib/prisma.js')


const postLogin = async (req, res) => {

  try {

    const {email, password} = req.body;

    console.log(email)
    console.log(password)


    if (email.trim().length <= 0 || password.trim().length <= 0)   {
      return res.status(200).send({
        message: 'поля не заполнены',
        success: false
      })
    }


    const findUser = await prisma.user.findFirst({
      where: {
        email: email
      }
    })


    if (!findUser)  {
      return res.status(200).send({
        message: 'Неверный email или пароль',
        success: false
      })
    }


    const hashPassword = await bcrypt.compare(password, findUser.password)

    const token  = jwt.sign({email: findUser.email}, process.env.SECRET_KEY, {expiresIn: '1h'})
    console.log(token)
    res.cookie('token', token)
    return res.status(200).send({
      message: 'Вы успешно авторизировались',
      success: true
    })


  } catch (error) {
    console.log(error)
    return res.status(200).send({
      message: `Что то пошло не так ${error}`,
      success: false
    })
  }
}

module.exports = postLogin