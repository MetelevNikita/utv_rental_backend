const fs = require('fs')
const path = require('path')

 function base64ToImageProduct(base64String, subfolder, endfolder, name) {


    if (!base64String) {
      throw new Error('base64String is required');
    }

    if (!subfolder || !endfolder) {
      throw new Error('subfolder and endfolder are required');
    }


    let pathToFolder

    pathToFolder = path.join(process.cwd(), 'public', 'upload', 'equipment', subfolder, endfolder)


    if (!fs.existsSync(path.join(process.cwd(), 'public', 'upload','equipment', subfolder))) {
      try {
        fs.mkdirSync(path.join(process.cwd(), 'public', 'upload', subfolder), { recursive: true })
        console.log(`Папка создана ${subfolder}`)
      } catch (error) {
        console.log(error)
      }
    }


    if (!fs.existsSync(path.join(process.cwd(), 'public', 'upload', 'equipment', subfolder, endfolder))) {
      try {
        fs.mkdirSync(path.join(process.cwd(), 'public', 'upload', 'equipment', subfolder, endfolder), { recursive: true })
        console.log(`Папка создана ${endfolder}`)
      } catch (error) {
        console.log(error)
      }
    }
  

  const buffer = Buffer.from(base64String, 'base64')

  const fileName = `image_${name}_${Date.now()}.png`
  fs.writeFileSync(pathToFolder + '/' + fileName, buffer)
  console.log(`Файл Продукта успешно записан ${fileName}`)

  

    try {
      return `/upload/equipment/${subfolder}/${endfolder}/${fileName}`
    } catch (error) {
      console.log(error)
      return error
    }
  
}

module.exports = { base64ToImageProduct }