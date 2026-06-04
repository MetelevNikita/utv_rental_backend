const express = require('express');

// module

const { getAllProduct, postProduct ,deleteProduct, patchProduct  } = require('../Controller/productController')

//


const productRouter = express.Router();

productRouter.get('/product', getAllProduct)

productRouter.post('/product',  postProduct)
productRouter.patch('/product/:id', patchProduct)

productRouter.delete('/product/:id',  deleteProduct)



module.exports = productRouter;