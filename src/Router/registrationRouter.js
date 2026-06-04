const express = require('express');

// module

const { getUsers, createUser, deleteUser } = require('../Controller/registrationController');


//

const registrationRouter = express.Router();


registrationRouter.get('/users', getUsers)

registrationRouter.post('/registration', createUser)

registrationRouter.delete('/users/:id', deleteUser)

//

module.exports = registrationRouter