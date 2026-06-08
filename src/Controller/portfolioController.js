const { prisma } = require('../../lib/prisma.js')

// 

const { base64ToImage } = require('./../utils/base64ToImage.js')

// 

const os = require('os')
const fs = require('fs')
const path = require('path')



const getAllPortfolio = async (req, res) => {
  try {

    const allPortfolio = await prisma.portfolio.findMany()

    if (allPortfolio.length < 1 || !allPortfolio) {
      return res.status(200).send([])
    }

    return res.status(200).send(allPortfolio)

    
  } catch (error) {
    console.log(error)
    res.status(500).send({message: 'Internal Server Error' })
  }
}




const postPortfolio = async  (req, res)  =>  {
  try {

    const data = req.body




    const { title, description, set, link, category, imageOne, imageTwo, imageThree } = req.body

    console.log(title, description, set, link, category)


    let imageArr = []

    let imgOne = null
    let imgTwo = null
    let imgThree = null


    if (imageOne) {

      imgOne = await base64ToImage(imageOne, 'portfolio', `event_${title}`, title)
      imageArr.push(imgOne)

    }

    if (imageTwo) {
      imgTwo = await base64ToImage(imageTwo, 'portfolio', `event_${title}`, title)
      imageArr.push(imgTwo)
    }


    if (imageThree) {
      imgThree = await base64ToImage(imageThree, 'portfolio', `event_${title}`, title)
      imageArr.push(imgThree)
    }

    console.log({
        title,
        description,
        set,
        link,
        category,
        image_one: imgOne ?? null,
        image_two: imgTwo ?? null,
        image_three: imgThree ?? null,
    })


    const newPortfolio = await prisma.portfolio.create({
      data: {
        title,
        description,
        set,
        link,
        category,
        image_one: imgOne ?? null,
        image_two: imgTwo ?? null,
        image_three: imgThree ?? null,
      }
    })


    if (!newPortfolio) {
      return res.status(400).send({
        message: 'Portfolio not created'
      })
    }


    console.log(newPortfolio)

    return res.status(200).send({message: `Карточка ${title} в портфолио успешно создана`})

  } catch (error) {
    console.log(error)
    res.status(500).send({message:  'Internal Server Error'})
  }
}



const deletePortfolio = async (req, res) => {

  try {

    const { id } = req.params

    if (!id) {
      return res.status(400).send({
        message: 'Не получен id'
      })
    }



    const currentComplect = await prisma.packProduct.findFirst({
      where: {
        id: parseInt(id)
      }
    })

    if (!currentComplect) {
      return res.status(400).send({
        message: 'Не найдена карточка комплекта в базе'
      })
    }

    const publicPath = path.join(process.cwd(), 'public')

    const relativeImagePath = currentComplect.imageOne.replace(/^\/+/, '')
    const filePath = path.join(publicPath, relativeImagePath);
    const folderPath = path.dirname(filePath);


    console.log(folderPath)

    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, {recursive: true, force: true})
      console.log('Папка комплекта удалена')
    } else {
        console.warn('Папка не найдена:', folderPath);
    }

    const deleteComplect = await prisma.packProduct.delete({
      where: {
        id: parseInt(id)
      }
    })

    if (!deleteComplect) {
      return res.status(400).send({
        message: 'Не удалось удалить карточку комплекта'
      })
    }

    return res.status(200).send({
      message: `Карточка товара ${id} успешно удалена`
    })

    
  } catch (error) {
    console.log(error)
    return res.status(500).send({message: 'Не удалось получить список комплектов' })
  }


}



const patchPortfolio = async (req, res) => {

  try {

    const { id } = req.params
    const card = await req.body

    const findPortfolioCard = await prisma.portfolio.findFirst({
      where: {
        id: Number(id)
      }
    })

    if (!findPortfolioCard) {
      console.error('Карточка портфолио с таким id не найдена')
      return res.status(200).send([])
    }


    const updateCard = await prisma.portfolio.update({
      where: {
        id: Number(id)
      },

      data: card
    })

    if (!updateCard) {
      console.error('Не удалось обновить карточку портфолио')
      return res.status(200).send({
        message: 'Не удалось обновить карточку портфолио',
        sucess: false
      })
    }
     
  } catch (error) {
    console.log(error)
    res.status(500).send({message:  'Internal Server Error'})
  }
}

module.exports = { getAllPortfolio, postPortfolio, deletePortfolio }