const { transporter } = require('./../utils/sendToEmail')
const { WebHookData } = require('./../utils/webHookMessage')


const webhookPostController = async (req, res) => {

  try {

    console.log('start work webhook')

    const data = await req.body

    const description = data.payload.description
    const emailRegex = /<strong>Почта<\/strong>\s*<br\s*\/?>\s*([^<\s]+@[^<\s]+)\s*<br\s*\/?>/i
    const telegramIdRegex = /<strong>Telegram id<\/strong>\s*<br\s*\/?>\s*([0-9]+)\s*<br\s*\/?>/i


    const email = description.match(emailRegex)?.[1] ?? null
    const telegramId = description.match(telegramIdRegex)?.[1] ?? null



    const {messageTG, messageHTML} = await WebHookData(data)


    if (email) {
          try {
            const sendEmail = await transporter.sendMail({
              from: 'utv-license@yandex.ru',
              to: 'Kyle.B@mail.ru', // list of recipients
              subject: "Статус заказа", // subject line
              text: "", // plain text body
              html: `<b>Статус заказа UTVrental.ru</b><br><p>${messageHTML}</p>`
            })

            
            console.log("Message sent: %s", sendEmail.messageId);
          } catch (error) {
            console.log(error)
          }
    }

    if (telegramId) {
      console.log('здесь логика телеги')
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