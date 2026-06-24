const dotenv = require('dotenv')
const path = require('path')

//



// 

dotenv.config({
  path: path.join(process.cwd(), '.env')
})


async function WebHookData (data, equipment, columnTask) {
  try {

    let messageTG;
    let messageHTML;

    if (data.event === 'task-created') {
      console.log('Проверка на создания новой карточки')
      messageTG = `Ваш заказ ${data.payload.title} создан\n\nСтатус: ${columnTask.data.title}\n\nЗаказ: ${equipment}\n\nДата изменения: ${new Date().toLocaleDateString('RU-ru')} - ${new Date().toLocaleTimeString('RU-ru')}`
      messageHTML = `Ваш заказ ${data.payload.title} создан</br></br>Статус: ${columnTask.data.title}</br></br>Заказ: ${equipment}</br></br>Дата изменения: ${new Date().toLocaleDateString('RU-ru')} - ${new Date().toLocaleTimeString('RU-ru')}`

      return {messageTG, messageHTML}
    }
    
    // move

    if (data.event === 'task-moved') {


      console.log('Проверяю статуст перемещения задачи')

      if (JSON.stringify(data.payload.columnId) === JSON.stringify(data.prevData.columnId)) {
        console.log('Карточка осталась на текущей доске')
        return null
      } else {

        messageTG = `Статус заказа: ${data.payload.title} изменен\n\nСтатус: ${columnTask.data.title}\n\nЗаказ: ${equipment}\n\nДата изменения: ${new Date().toLocaleDateString('RU-ru')} - ${new Date().toLocaleTimeString('RU-ru')}`
        messageHTML = `Статус заказа: ${data.payload.title} изменен</br></br>Статус: ${columnTask.data.title}</br></br>Заказ: ${equipment}</br></br>Дата изменения: ${new Date().toLocaleDateString('RU-ru')} - ${new Date().toLocaleTimeString('RU-ru')}`

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