const path = require('path')
const dotenv = require('dotenv').config({
  path: path.resolve(process.cwd(), '.env')
})

const TelegramBot = require('node-telegram-bot-api')
const { SocksProxyAgent } = require('socks-proxy-agent')

const TOKEN = process.env.TOKEN


async function bot () {


  const agent = new SocksProxyAgent(
     `socks5h://${process.env.PROXY_USER}:${process.env.PROXY_PASSWORD}@${process.env.PROXY_HOST}:${process.env.PROXY_PORT}`,
  )

  if (!TOKEN) {
    throw new Error('Ошибка создания телеграм бота! Не переданы параетры TOKEN доступа')
  }

  // global

  if (!globalThis.telegramBot) {
  globalThis.telegramBot = new TelegramBot(TOKEN, {
    polling: {
      interval: 300,
      autoStart: true,
      params: {
        timeout: 10
      }
    },
    request: {
      agent,
      timeout: 10000
    }
  })
}

return globalThis.telegramBot
}






module.exports = {bot}