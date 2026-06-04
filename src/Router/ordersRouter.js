const express = require('express')

// module

const { getOrders, postOrders, deleteOrders } = require('../Controller/ordersController.js')

// 

const ordersRouter = express.Router()



ordersRouter.get('/order', getOrders)
ordersRouter.post('/order', postOrders)
ordersRouter.delete('/order/:id', deleteOrders)


module.exports = ordersRouter