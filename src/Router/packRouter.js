const express = require('express')

// module

const { getAllComplect, postComplect, deleteComplect, patchComplect } = require('./../Controller/packController.js')

// 

const packRouter = express.Router()


packRouter.get('/complect', getAllComplect)
packRouter.post('/complect', postComplect)
packRouter.delete('/complect/:id', deleteComplect)
packRouter.patch('/complect/:id', patchComplect)


// 

module.exports = packRouter
