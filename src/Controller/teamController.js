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


const deleteTeamCard  = async  (req, res)  =>  {
  const { id } = req.params

  console.log(id)

  if(!id.typeof ===  'number')  {
    res.status(400).json({message:  'Id не число'})
  }


  const currentTeam = await prisma.team.findFirst({
    where: {
      id: Number(id)
    }
  })


  const pathUpload = path.join(process.cwd(), 'public')
  const fullPath = path.join(pathUpload, currentTeam.image)

  console.log('PATH ', fullPath)


  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath)
  } else {
    console.log('Файл в папке на удаления не найден')
  }

   

  const deleteTeam = await prisma.team.delete({
    where: {
      id: Number(id)
    }
  })

  if (!deleteTeam) {
    return res.status(400).json({
      message: 'Карточка не удалена'
    })
  }


  return res.status(200).json({message: `Файл удален ${currentTeam.image}`})





  res.send('asdasdasd')





}


module.exports = { getTeamCard, createTeamCard, deleteTeamCard }