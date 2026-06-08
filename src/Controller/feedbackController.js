const { bot } = require('./../utils/TelegramBot.js')
const { prisma } = require('./../../lib/prisma.js')
const { error } = require('node:console')




async function sendToTelegram (data) {
    try {
    const telegramBot = await bot()
    const id = process.env.CHAT_ID

    let message = `Новоое сообщение с сайта\n\nИмя автора - ${data.name}\n\nТелефон - ${data.phone}\n\nemail - ${data.email}\n\nСообщение - ${data.text}\n\nДата создания ${new Date().toLocaleDateString('RU-ru')}`

    const resMessage = await telegramBot.sendMessage(id, message)
    console.log(resMessage)
      
    } catch (error) {
      console.error(`Ошибка отправки сообщения в телеграм ${error.message}`)
      return `Ошибка отправки сообщения в телеграм ${error.message}`
    }
  }

  

  async function sendToDB (data) {


    const newData = {
      ...data,
      agree: data.agree.toString()
    }

  
    const newMessage =  await prisma.feedback.create({
      data: newData
    })

    if (!newMessage) {
      console.error('Ошибка сохранения в базе данных')
      return
    }

    console.log('Сообщение в базу отправлено')
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

  try {

    const data = req.body
    console.log(data)

    await Promise.all([sendToDB(data), sendToTelegram(data)]).then((res) => {
      console.log('Данные отправлены ', data)
    }).catch((error) => {
      console.error('Ошибка отправки данных ', error)
    })

    res.status(200).send({
      message: 'Success'
    })
    
  } catch (error) {
    console.error(`Ошибка создания сообщения фидбека ${error.message}`)
    res.status(500).send({
      message: 'error'
    })
  }



} 



module.exports = {getFeedbackMessage, createFeedbackMessage}