const express = require('express')

// controller

const { postBid } = require('../Controller/bidController')


const bidRouter = express.Router()


bidRouter.post('/bid', postBid)


module.exports = bidRouter