const Pool = require("../database/db")


const getAllProduct = async (req, res) => {
  try {

    const allProduct = await Pool.query("SELECT * FROM product")

    if(allProduct.rows.length < 1)  {
      res.status(404).send([])
      return
    }

    res.status(200).send(allProduct.rows)

  } catch (error) {
    console.log(error)
    res.status(500).send({message: 'Internal Server Error' })

  }
}


const getSingleProduct = async (req, res) => {
  try {

    const { id } = req.params
    const  singleProduct  = await Pool.query("SELECT * FROM product WHERE id = $1", [id])

    if(product.rows.length  <  1)   {
      res.status(404).send({message:  'No Product Found'})
    }

    res.status(200).send(singleProduct.rows[0])

  } catch (error) {
    console.log(error)
    res.status(500).send({message: 'Internal Server Error' })
  }

}



const postProduct  = async  (req, res)  => {
  try {

    const { title, category, description, price, quantity } = req.body
    const host = req.host;



    const filePath = "http://localhost:8000/upload/equipment/" + req.file.originalname

    const newProduct = await Pool.query("INSERT INTO product ( title, category, description, price, quantity, image ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",  [title, category, description, price, quantity, filePath])

    if(newProduct.rows.length  <  1)   {
      res.status(404).send({message:  'Product not Created'})
      return
    }

    res.status(200).send(newProduct.rows[0])

  } catch (error) {
    console.log(error)
    res.status(5000).send({message:  'Internal Server Error' })

  }
}




const deleteProduct  = async  (req, res)  =>  {
  try {

    const { id } = req.params
    const deleteProduct  = await Pool.query("DELETE FROM products WHERE id  =  $1",  [id])

    if(deleteProduct.rows.length  <  1)    {
      res.status(404).send({message:   'Product not Deleted'})
      return
    }

    res.status(200).send(deleteProduct.rows[0])

  } catch (error) {
    console.log(error)
    res.status(500).send({message: 'Internal Server Error'})

  }
}



module.exports = { getAllProduct, getSingleProduct, postProduct,deleteProduct }