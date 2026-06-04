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







const deletePortfolio  = async  (req, res)  =>  {
  try {

    const { id } = req.params
    console.log(id)


    const getCuurentPortofioCard = await prisma.portfolio.findFirst({
      where: {
        id: parseInt(id)
      }
    })

    if (!getAllPortfolio) {
      return res.status(200).send({
        message: 'Не найдена карточка портфолио в базе'
      })
    }


    console.log(getCuurentPortofioCard)


    // let arch;
    
    // if (os.arch() === 'x64') {
    //   arch = '\\'
    // } else if (os.arch() === 'arm64' || os.arch() === 'arm') {
    //   arch = '/'
    // } else {
    //   arch = '\\'
    // }



    // const splitPath = getCuurentPortofioCard.image_one.split(arch)
    // const endPath = splitPath.slice(0, splitPath.length-1).join(arch)
    // console.log(endPath)


    // if (fs.existsSync(path.join(process.cwd(), 'public', endPath))) {
    //   fs.rmdirSync(path.join(process.cwd(), 'public', endPath), {recursive: true, force: true})
    // } else {
    //   console.warn('Изображение в базе не найдено')
    // }

    // const deleteProtfolioCard = await prisma.portfolio.delete({
    //   where: {
    //     id: parseInt(id)
    //   }
    // })

    // if (!deleteProtfolioCard) {
    //   return res.status(400).send(`Карточка не удалена из портфолио`)
    // }

    return res.status(200).send({
      message: `Карточка портфолио`
    })


  } catch (error) {
    console.log(error)
    res.status(500).send({message:  'Internal Server Error'})

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