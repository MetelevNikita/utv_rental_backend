const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid');

 async function base64ToImage(base64String, subfolder, endfolder, name) {

  const id = Date.now()
  const hash = uuidv4()

  let pathToFolder


  if (endfolder) {
    pathToFolder = path.join(process.cwd(), 'public', 'upload', subfolder, endfolder)


    if (!fs.existsSync(path.join(process.cwd(), 'public', 'upload', subfolder))) {
      try {
        fs.mkdirSync(path.join(process.cwd(), 'public', 'upload', subfolder), { recursive: true })
        console.log(`Папка создана ${subfolder}`)
      } catch (error) {
        console.log(error)
      }
    }


    if (!fs.existsSync(path.join(process.cwd(), 'public', 'upload', subfolder, endfolder))) {
      try {
        fs.mkdirSync(path.join(process.cwd(), 'public', 'upload', subfolder, endfolder), { recursive: true })
        console.log(`Папка создана ${endfolder}`)
      } catch (error) {
        console.log(error)
      }
    }
  } else {

    pathToFolder = path.join(process.cwd(), 'public', 'upload', subfolder)

    if (!fs.existsSync(path.join(process.cwd(), 'public', 'upload', subfolder))) {
      try {
        fs.mkdirSync(path.join(process.cwd(), 'public', 'upload', subfolder), { recursive: true })
        console.log(`Папка создана ${subfolder}`)
      } catch (error) {
        console.log(error)
      }
    }

  }



  const buffer = Buffer.from(base64String, 'base64')

  const fileName = `image_${name}_${Date.now()}_hash:${hash}.png`
  fs.writeFileSync(pathToFolder + '/' + fileName, buffer)
  console.log(`Файл успешно записан ${fileName}`)

  

  if (endfolder) {
    try {
      return `/upload/${subfolder}/${endfolder}/${fileName}`
    } catch (error) {
      console.log(error)
    }
  } else {
    try {
      return `/upload/${subfolder}/${fileName}`
    } catch (error) {
      console.log(error)
    }
  }

}

module.exports = { base64ToImage }