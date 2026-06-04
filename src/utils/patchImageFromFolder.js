const fs = require('fs')
const path = require('path')
const os = require('os')
const { base64ToImageProduct } = require('./base64ToImageProduct.js')
const { base64ToImage } = require('./base64ToImage.js')

// 


async function patchImageFromFolder (newImageBase64, oldImagePath) {

  try {
    
    const imageOneParse =  path.parse(oldImagePath)
    const splitPath = imageOneParse.dir.split('/')

    console.log(splitPath.length)

    let subfolder;
    let endfolder;

    if (splitPath.length === 5) {
      subfolder = splitPath[3]
      endfolder = splitPath[4]
    } else if (splitPath.length === 4) {
      endfolder = splitPath[3]
    }


    let changeImage;


    if (splitPath.length === 4) {
      changeImage = await base64ToImage(newImageBase64, endfolder, `${imageOneParse.name}`)
      console.log('SPLIT на 4 ', changeImage)
    }

    if (splitPath.length === 5) {
      changeImage = await base64ToImageProduct(newImageBase64, subfolder, endfolder, `${imageOneParse.name}`)
      console.log('SPLIT на 5 ', changeImage)
    }


    // delete old image


    const folderImage = path.join(process.cwd(), 'public', oldImagePath)
    const data = fs.unlinkSync(folderImage)
    console.log(data)
    return changeImage


  } catch (error) {

    if (error instanceof Error) {
      console.error(`Ошибка обновления изображения ${error.message}`)
      return {
        message: `Ошибка обновления изображения ${error.message}`
      }
    }

    console.error(`Ошибка обновления изображения ${error}`)
    return {
      message: `Ошибка обновления изображения ${error.message}`
    }
    
  }

}


module.exports = { patchImageFromFolder }
