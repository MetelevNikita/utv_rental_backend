const { prisma } = require('../../lib/prisma.js')
const { base64ToImage } = require('./../utils/base64ToImage.js')
const fs = require('fs')
const path = require('path')


// 


const endPoint = 'team'


// get


const getTeamCard = async (req, res) => {

  try {

    const allTeams = await prisma.team.findMany({})

    if (!allTeams) {
      return res.status(400).send({
        message: 'Карточки не найдены'
      })
    }

    if (allTeams.length  <  1) {
      return res.status(200).send([])
    }

    return res.status(200).send(allTeams)

  } catch (error) {
    console.log(error)
    return res.status(400).send([])
  }
}


// create


const createTeamCard = async (req, res) => {

  try {

    const data = req.body

    const {name, profession, image} = req.body


    const urlImage = base64ToImage(data.image, endPoint, name)
    console.log(urlImage)


    const newTeam = await prisma.team.create({
      data: {
        name: name,
        profession: profession,
        image: urlImage
      }
    })


    if (!newTeam) {
      return res.status(400).send({
        message: 'Карточка не создана'
      })
    }

    return res.send({message: 'Новый пользователь успешно создан'})


  } catch (error) {
    console.log(error)
    res.status(500).json({message:  'internal server error'})
  }

}



// delete


const deleteTeamCard = async (req, res) => {

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





module.exports = { getTeamCard, createTeamCard, deleteTeamCard }