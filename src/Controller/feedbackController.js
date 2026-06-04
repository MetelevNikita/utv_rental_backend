const { telegramBot } = require('./../utils/TelegramBot.js')
const { prisma } = require('./../../lib/prisma.js')





const messageObj = {

  sendToTelegram: async function (chatId) {
    try {
    const bot = telegramBot()


    console.log('CHAT ID!!!!!!', chatId)

    let message = `Новоое сообщение с сайтаn\n\nИмя автора - ${this.name}\nТелефон - ${this.phone} \t email - ${this.email}\n\nСообщение - ${this.text}\n\nДата создания ${this.createAt}`

    const resMessage = await bot.sendMessage(chatId, message)
    console.log(resMessage)
    console.warn('Сообщение успешно отправлено')
      
    } catch (error) {
      return error
    }

  },
  sendToYouGile: async function () {
    console.warn('Сообщение в ЮДЖАЙЛ Отправлено')
  },
  sendToDB: async function () {
    const newMessage =  await prisma.feedback.create({
      data: {
        name: this.name,
        phone: this.phone,
        email: this.email,
        text: this.text,
        agree: this.agree.toString()
      }
    })

    if (!newMessage) {
      console.error('Ошибка сохранения в базе данных')
      return
    }

    console.log('Сообщение в базу отправлено')
  },
}


const getFeedbackMessage = async (req, res) => {

  try {

    const allMessage = await prisma.feedback.findMany()

    if (!allMessage) {
      res.status(200).send([])
    }

    res.status(200).send(allMessage)
    
  } catch (error) {

    res.status(400).send({
      message: 'Error'
    })
    
  }
}



const createFeedbackMessage = async (req, res) => {

  const data = req.body
  console.log(data)

  console.log('Start')

  const newObj = Object.assign(data, messageObj)

  Promise.all([newObj.sendToTelegram('85252645'), newObj.sendToDB(data)]).then((data) => {
    console.log(data)
  })






  res.status(200).send({
    message: 'Success'
  })


} 



module.exports = {getFeedbackMessage, createFeedbackMessage}