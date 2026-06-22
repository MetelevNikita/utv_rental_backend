const express = require('express')

// controller

const {docsController} = require('../Controller/docsController.js')

// 


const docsRouter = express.Router()


docsRouter.get('/docs/:endpoint', docsController)



module.exports = docsRouter