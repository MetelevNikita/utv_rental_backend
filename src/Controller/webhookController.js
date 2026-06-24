const { transporter } = require('./../utils/sendToEmail')
const { WebHookData } = require('./../utils/webHookMessage')
const { sendFileToEmail } = require('./../utils/sendFileToEmail')



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


const webhookPostController = async (req, res) => {

  try {

    console.log('start work webhook')

    const data = await req.body

    const description = data.payload.description
    const emailRegex = /<strong>Почта<\/strong>\s*<br\s*\/?>\s*([^<\s]+@[^<\s]+)\s*<br\s*\/?>/i
    const telegramIdRegex = /<strong>Telegram id<\/strong>\s*<br\s*\/?>\s*([0-9]+)\s*<br\s*\/?>/i
    const equipmentRegex = /<strong>Список оборудования<\/strong>\s*<br\s*\/?>\s*([\s\S]*?)\s*<br\s*\/?>\s*<br\s*\/?>\s*<strong>Цена аренды<\/strong>/i

    const key = process.env.YG_KEY
    const url = 'https://ru.yougile.com/api-v2'

    const email = description.match(emailRegex)?.[1] ?? null
    const telegramId = description.match(telegramIdRegex)?.[1] ?? null
    const equipmentList = description.match(equipmentRegex)[0].split('<br />')[1]


    const columnTask = await getYGColumns(data.payload.columnId, key, url)
    const resFile = await sendFileToEmail(data.payload.id)

    console.log('TASK ', columnTask)
  
    const {messageTG, messageHTML} = await WebHookData(data, equipmentList, columnTask)

    if (email) {
          try {
            const sendEmail = await transporter.sendMail({
              from: 'utv-license@yandex.ru',
              to: email, // list of recipients
              subject: "Статус заказа", // subject line
              text: "", // plain text body
              html: `<b>Информация о заказе с сайта UTVrental.ru</b><br><p>${messageHTML}</p>`
            })

            
            console.log("Message sent: %s", sendEmail.messageId);
          } catch (error) {
            console.log(error)
          }
    }

    if (telegramId) {
      console.log('здесь логика телеги')
    }


    if (columnTask.data.title === 'Обработано') {

      console.log('OK')

      if (resFile.success) {
        try {
              const sendEmail = await transporter.sendMail({
                from: 'utv-license@yandex.ru',
                to: email,
                subject: `Договор аренды к заказу ${data.payload.title}`,
                text: "",
                html: `<b>Договор с сайта UTVrental.ru</b><br><p>Во вложении файл</p>`,
                attachments: [
                  {
                    filename: resFile.name,
                    content: resFile.data,
                    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  }
                ],
              })

              
              console.log("Message sent: %s", sendEmail.messageId);
            } catch (error) {
              console.log(error)
            }
      }
    }






    res.status(200).send({
      message: 'DONE WEBHOOK'
    })
    
  } catch (error) {
    console.log(error)
    return res.status(200).send({
      message: `Что то пошло не так ${error}`,
      success: false
    })
  }


}


module.exports = webhookPostController