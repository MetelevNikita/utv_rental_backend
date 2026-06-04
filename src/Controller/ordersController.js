const fs = require('fs')
const path = require('path')

// prisma

const { prisma } = require('../../lib/prisma.js')

// telegram

const { bot } = require('../utils/TelegramBot.js')


// lib

const { message }  = require('../../lib/message.js')


async function createOrderDatabase (dataOrder) {
  try {

    const postNewOrder = await prisma.order.create({
      data: {
        ...dataOrder
      }
    })


    if (!postNewOrder) {
      return {
        message: 'Не удалось создать заказ в базе данных',
        success: false
      }
    }

    return {
      message: 'Заказ в базе данных создан',
      success: true
    }
    
  } catch (error) {
    console.log(error)
    return {
      message: 'ERROR ' + error.message,
      suceess: false
    }
  }
}


async function sendToTelegram(dataOrder) {

  const chatId = process.env.CHAT_ID
  console.log(chatId)

  const telegramBot = await bot()
  console.log(telegramBot)

  const newMessageTg = await telegramBot.sendMessage(chatId, dataOrder, {parse_mode: 'HTML'})

  if (!newMessageTg) {
    return {
      message: 'Ошибка отправки сообщения в Телешграм',
      success: false
    }
  }

  return {
    message: 'Сообщение в телеграм отправлено',
    success: true
  }

}


async function sendToYouGile(title, task) {

  const YG_Key = process.env.YG_KEY
  const url = 'https://ru.yougile.com/api-v2'

  try {

 
    async function youGileFn (key, endpoint, url) {
      try {

        const responce = await fetch(`${url}/${endpoint}`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            "Authorization": `Bearer ${key}`
          }
        })

        if (!responce.ok) {
          return {
            message: 'Ошибка получения данных Yougile',
            success: false
          }
        }

        const data = await responce.json()
        return data
        
      } catch (error) {
        console.error('Ошибка ', error.message)
        return {
          message: 'Ошибка ' + error.message,
          success: false
        }
      }
      
    }

    async function createTaskYouGile (key, title, columnId, task) {
      try {

        const responce = await fetch(`${url}/tasks`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            "Authorization": `Bearer ${key}`
          },
          body: JSON.stringify({
            title: title,
            columnId: columnId,
            description: task,
          })
        })

        const data = await responce.json()
        console.log('RES TO CREATE YOUGILE ', data)
        return data
        
      } catch (error) {
        console.error('Ошибка ', error.message)
        return {
          message: 'Ошибка ' + error.message,
          success: false
        }
      }
    }

    // project

    const getAllProject = await youGileFn(YG_Key, 'projects', url)
    const currentProject = getAllProject.content.find(item => item.title == 'UTV_RENTACAM')

    // board

    const getAllBoard = await youGileFn(YG_Key, `boards?projectId=${currentProject.id}`, url)
    const currentBoard = getAllBoard.content.find(item => item.title == 'Заказы')

    // column

    const getAllColumn = await youGileFn(YG_Key, `columns?boardId=${currentBoard.id}`, url)
    const currentColumn = getAllColumn.content.find(item => item.title == 'Входящие')

    console.log(currentColumn)

    const createTask = await createTaskYouGile(YG_Key, title, currentColumn.id, task)
    console.log(createTask)

    if (!createTask) {
      return {
        message: 'Ошибка создания карточки в Yougile',
        success: false
      }
    }

    return {
        message: 'Карточка в Yougile содана',
        success: true
      }
    
  } catch (error) {
    return {
      message: 'Ошибка создания сообщения ' + error.message,
      success: false
    }
  }
  
}


// 



const getOrders = async (req, res) => {
  try {

    const allOrder = await prisma.order.findMany()

    if (!allOrder || allOrder.length < 1) {
      return res.status(200).send([])
    }

    res.status(200).send(allOrder)
  
    
  } catch (error) {
    console.log(`error ${error.message}`)
    return res.status(500).send({
      message: `SERVER ERROR ${error.message}`
    })
  }
}



const postOrders = async (req, res) => {
  try {


    console.log('START SEND ORDER')


    const data = req.body

    const { yg, tg } = message(data)

    const resOrder = await Promise.all([sendToYouGile(`Новая завявка аренды${data.name}`, yg), sendToTelegram(tg), createOrderDatabase(data)]).catch(error => error)
    console.log('Все данные отправлены ', resOrder)

    res.status(200).send({
      message: `post new orders`
    })
  
    
  } catch (error) {
    console.log(`error ${error.message}`)
    return res.status(500).send({
      message: `SERVER ERROR ${error.message}`
    })
  }
}



const deleteOrders = async (req, res) => {
  try {

    const { id } = req.params

    const findOrder = await prisma.order.findFirst({
      where: {
        id: parseInt(id)
      }
    })

    if (!findOrder) {
      return res.status(500).send({
        message: `Не найдено заказы с таким id - ${id}`,
        success: false
      })
    }


    const deleteOrder = await prisma.order.delete({
      where: {
        id: parseInt(id)
      }
    })

    if (!deleteOrder) {
      return res.status(500).send({
        message: `Ошибка. Заказ с таким id - ${id} не удален`,
        success: false
      })
    }


      return res.status(500).send({
        message: `Заказ ${id} удален`,
        success: false
      })

    res.status(200).send({
      message: 'delete order'
    })
  
    
  } catch (error) {
    console.log(`error ${error.message}`)
    return res.status(500).send({
      message: `SERVER ERROR ${error.message}`
    })
  }

}


module.exports = { getOrders, postOrders, deleteOrders }