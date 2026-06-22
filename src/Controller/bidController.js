const { prisma } = require('./../../lib/prisma.js')
const { bot } = require('../utils/TelegramBot.js')




const getBid = async (req, res) => {
    try {

        const allBid = prisma.bid.findMany()

        if (!allBid) {
            return res.status(200).send({
                message: 'Все карточки получены',
                data: allBid
            })
        }
        
    } catch (error) {
        console.log(`error ${error.message}`)
        return res.status(500).send({
            message: `SERVER ERROR ${error.message}`,
            data: null
        })
    }
}



const postBid = async (req, res) => {

    const idGroup = process.env.CHAT_ID

    try {

        const telegramBot = await bot()

        if (!idGroup) {
            res.status(400).send({
                message: 'Не получен телеграм Id группы'
            })
        }

        const body = req.body
        delete body.politic

        console.log('NEW BODY ', body)

        // prisma

        const newBid = await prisma.bid.create({
            data: body
        })

        console.log(newBid)
        
        // tg

        const message = `Сообщение с сайта utv-reantal.ru\n\nТема:\n${body.titleForm}\n\nИмя:\n${body.fio}\n\nТелефон:\n${body.phone}\n\nПочта:\n${body.email}\n\nСообщение:\n${body.message}\n\n\nСообщение создано: ${new Date().toLocaleDateString('RU-ru')}`

        const tgMessage = await telegramBot.sendMessage(idGroup, message, {parse_mode: 'HTML'})
        console.log(tgMessage)

        return res.status(200).send({
            success: true,
            message: `Сообщение под заголовком ${body.titleForm} Создано`,
            data: 'newBid'
        })
        
    } catch (error) {
        console.log(`error ${error.message}`)
        return res.status(500).send({
            success: false,
            message: `SERVER ERROR ${error.message}`,
            data: null
        })
    }

}

module.exports = { postBid }