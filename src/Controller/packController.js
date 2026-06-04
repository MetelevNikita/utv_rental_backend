const path = require('path')
const fs = require('fs')
const os = require('os')

// utill

const { base64ToImage } = require('../utils/base64ToImage.js')
const { patchImageFromFolder } = require('./../utils/patchImageFromFolder.js')



const { prisma } = require('./../../lib/prisma.js')


const getAllComplect = async (req, res) => {

  try {

    const allComplect = await prisma.packProduct.findMany()

    if (!allComplect || allComplect.length < 1) {
      return res.status(200).json([])
    }

    res.status(200).send(allComplect)
    
  } catch (error) {
    console.error('Не найден метод получение комплектов')
    res.status(500).send({message: 'Не удалось получить список комплектов' })
  }
  
}


const postComplect = async (req, res) => {
  try {

    const uuid = Date.now()

    const { title, description, set, price, quantity, imageOne, imageTwo, imageThree } = req.body

    console.log(title, description, set, price, quantity)


    let imgOne;
    let imgTwo;
    let imgThree


    if (imageOne) {
      imgOne = await base64ToImage(imageOne, 'complect', `${uuid}_${title.trim()}`, title)
    }

    if (imageTwo) {
      imgTwo = await base64ToImage(imageTwo, 'complect', `${uuid}_${title.trim()}`, title)
    }

    if (imageThree) {
      imgThree = await base64ToImage(imageThree, 'complect', `${uuid}_${title.trim()}`, title)
    }




    console.log('IMAGES')
    console.log(imgOne, imgTwo, imgThree)

    const newComplect = await prisma.packProduct.create({
      data: {
        title,
        description,
        set,
        price,
        quantity,
        imageOne: imgOne ?? null,
        imageTwo: imgTwo ?? null,
        imageThree: imgThree ?? null
      }
    })

    if (!newComplect) {
      return res.status(400).send({
        message: 'Коплект не создан'
      })
    }

    return res.status(200).send({message: `Комплект успешно создан`})

    
  } catch (error) {
    console.log(error)
    return res.status(500).send({message: 'Не удалось получить список комплектов' })
  }
}


const deleteComplect = async (req, res) => {

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



    let arch;
    
    if (os.arch() === 'x64') {
      arch = '\\'
    } else if (os.arch() === 'arm64' || os.arch() === 'arm') {
      arch = '/'
    } else {
      arch = '\\'
    }

    // 


    if (currentComplect.imageOne) {
      const splitPath = currentComplect.imageOne.split(arch)
      const endPath = splitPath.slice(0, splitPath.length-1).join(arch)

      if (fs.existsSync(path.join(process.cwd(), 'public', endPath))) {
        fs.rmdirSync(path.join(process.cwd(), 'public', endPath), {recursive: true, force: true})
      } else {
        console.warn('Изображение в базе не найдено')
      }
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


const patchComplect = async (req, res) => {
  try {


    const { id } = req.params

    const card = await req.body

    console.log('ID ', id)
 

    const currentCard = await prisma.packProduct.findFirst({
      where: {
        id: Number(id)
      }
    }) 


    if (!currentCard) {
      return res.status(200).send({
        message: `Карточка коммплекта с таким id - ${id} не найдена`
      })
    }


    let changeImageOne;
    let changeImageTwo;
    let changeImageThree;

  
    if (card.imageOne && currentCard.imageOne) {
      changeImageOne = await patchImageFromFolder(card.imageOne, currentCard.imageOne)
      console.log('imageOne ', changeImageOne)
      card.imageOne = changeImageOne
    }

   if (card.imageTwo && currentCard.imageTwo)  {
      changeImageTwo = await patchImageFromFolder(card.imageTwo, currentCard.imageTwo)
      console.log('imageTwo ', changeImageTwo)
      card.imageTwo = changeImageTwo
    }
    

    if (card.imageThree && currentCard.imageThree) {
      changeImageThree = await patchImageFromFolder(card.imageThree, currentCard.imageThree)
      console.log('imageThree ', changeImageThree)
      card.imageThree = changeImageThree
    }




    const changePackComplect = await prisma.packProduct.update({
      where: {
        id: Number(id)
      },

      data: card
    })

    if (!changePackComplect) {
      return res.status(200).send({
        message: `Карточка коммплекта с таким id - ${id} не изменена`
      })
    }

    return res.status(200).send({
      message: 'Карточка комплекта изменена',
      sucess: true
    })
    
  } catch (error) {
    console.log(error)
    return res.status(500).send({message: 'Не изменить комплект' })
  }
}


module.exports = { getAllComplect, postComplect, deleteComplect, patchComplect }
