const express = require('express');





// module

const { getAllPortfolio, postPortfolio, deletePortfolio } = require('../Controller/portfolioController')


//

const portfolioRouter = express.Router();

//


portfolioRouter.get('/portfolio', getAllPortfolio)

portfolioRouter.post('/portfolio',  postPortfolio)

portfolioRouter.delete('/portfolio/:id', deletePortfolio)



module.exports = portfolioRouter;