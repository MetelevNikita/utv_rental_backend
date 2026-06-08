const dotenv = require('dotenv')
const path = require('path')

//

async function getYGColumns (boardId, key, url) {

  try {

    const responce = await fetch(`${url}/columns/${boardId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        "Authorization": `Bearer ${key}`
      }
    })

    if (!responce.ok) {
      console.error('error API')
      return {
        success: false,
        message: `error API ${responce.status} - ${responce.statusText}`,
        data: null
      }
    }

    const data = await responce.json()

    return {
        success: true,
        message: `data done ${responce.status}`,
        data: data
    }


    
  } catch (error) {

    if (error instanceof Error) {
      console.error(`Ошибка создания вебухка ${error.message}`)
      return {
        success: false,
        message: `Ошибка создания вебухка ${error.message}`
      }
    }

      console.error(`Неизвестная ошибка ${error}`)
      return {
        success: false,
        message: `Неизвестная ошибка ${error}`
      }
    }

  
}

// 

dotenv.config({
  path: path.join(process.cwd(), '.env')
})


async function WebHookData (data) {
  try {

    const key = process.env.YG_KEY
    const url = process.env.YG_URL

    let messageTG;
    let messageHTML;

    if (data.event === 'task-created') {
      console.log('Проверка на создания новой карточки')
      const columnTask = await getYGColumns(data.payload.columnId, key, url)

      messageTG = `Ваш заказ ${data.payload.title} создан\n\nСтатус: ${columnTask.data.title}\n\nДата изменения: ${new Date().toLocaleDateString('RU-ru')} - ${new Date().toLocaleTimeString('RU-ru')}`
      messageHTML = `Ваш заказ ${data.payload.title} создан</br></br>Статус: ${columnTask.data.title}</br></br>Дата изменения: ${new Date().toLocaleDateString('RU-ru')} - ${new Date().toLocaleTimeString('RU-ru')}`

      return {messageTG, messageHTML}
    }
    
    // move

    if (data.event === 'task-moved') {


      console.log('Проверяю статуст перемещения задачи')

      if (JSON.stringify(data.payload.columnId) === JSON.stringify(data.prevData.columnId)) {
        console.log('Карточка осталась на текущей доске')
        return null
      } else {

        const columnTask = await getYGColumns(data.payload.columnId, key, url)

        messageTG = `Статус заказа: ${data.payload.title} изменен\n\nСтатус: ${columnTask.data.title}\n\nДата изменения: ${new Date().toLocaleDateString('RU-ru')} - ${new Date().toLocaleTimeString('RU-ru')}`
        messageHTML = `Статус заказа: ${data.payload.title} изменен</br></br>Статус: ${columnTask.data.title}</br></br>Дата изменения: ${new Date().toLocaleDateString('RU-ru')} - ${new Date().toLocaleTimeString('RU-ru')}`

        return {messageTG, messageHTML}
      }

    }


    return {
      messageTG: '',
      messageHTML: ''
    }

  } catch (error) {
      console.error(`Ошибка обработки данных вебхука ${error.message}`)
      return {
        success: false,
        message: `Ошибка обработки данных вебхука ${error.message}`
      }
  }
}

module.exports = { WebHookData }