const { Router } = require('express')

// controller

const webhookPostController = require('../Controller/webhookController')

// 


const webhookRouter = Router()

webhookRouter.post('/webhook', webhookPostController)

module.exports = webhookRouter