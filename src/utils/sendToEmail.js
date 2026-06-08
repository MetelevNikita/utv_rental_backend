const nodemailer = require('nodemailer')


const loginYa = process.env.YANDEX_LOGIN
const passYa = process.env.YANDEX_PASS


const options = {
  host: 'smtp.yandex.com',
  port: 587,
  secure: false,
  family: 4,
  auth: {
    user: loginYa,
    pass: passYa
  }
}


const transporter = nodemailer.createTransport(options)

// 


module.exports = {transporter}