const { getYouGileChat } = require('../utils/YouGileChat')
const { transporter } = require('../utils/sendToEmail')


async function sendFileToEmail(taskId, columnId) {
    try {

        const key = process.env.YG_KEY
        const url = 'https://ru.yougile.com/api-v2'

        const chatInfo = await getYouGileChat(taskId, url)

        const messageText = chatInfo.content[0].text;
        const rawFilePath = messageText.match(/#file:(.+)$/)?.[1];

        if (!rawFilePath) {
            console.log('Не найден файл в сообщении')
            return
        }

        const filePath = decodeURIComponent(rawFilePath);

        console.log('DeCODE ', filePath)
        const fileUrl = `https://ru.yougile.com${filePath}`;


        const fileRes = await fetch(fileUrl, {
            headers: {
                Authorization: `Bearer ${key}`,
            },
        });


        if (!fileRes.ok) {
        throw new Error(`Не удалось скачать файл: ${fileRes.status}`);
        }

        const fileBuffer = Buffer.from(await fileRes.arrayBuffer());
        const fileName = decodeURIComponent(filePath.split('/').pop());

        return {
            success: true,
            message: 'Данные файла получены',
            name: fileName,
            data: fileBuffer
        }


    } catch (error) {
        console.error(`Ошибка отпрвки файла из YouGile ${error.message}`)
        return {
            success: false,
            message: `Ошибка отпрвки файла из YouGile ${error.message}`,
            name: null,
            data: null
        }
    }
}

module.exports = { sendFileToEmail }