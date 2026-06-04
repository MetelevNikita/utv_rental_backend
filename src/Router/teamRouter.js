const express = require('express');
const multer = require('multer')

// middleware

const authJwtToken = require('../middleware/authJwtToken');


// module

const { getTeamCard, createTeamCard, deleteTeamCard } = require('../Controller/teamController')

//

const teamRouter = express.Router();


teamRouter.get('/team', getTeamCard)
teamRouter.post('/team', createTeamCard)
teamRouter.delete('/team/:id',  deleteTeamCard)

//

module.exports = teamRouter;