const { prisma } = require('./../../lib/prisma.js')
const fs = require('fs')
const path = require('path')
const os = require('os')


// utill

const { base64ToImageProduct } = require('./../utils/base64ToImageProduct.js')
const { patchImageFromFolder } = require('./../utils/patchImageFromFolder.js')

// 


async function replaceImageFolder (newImageBase64, oldImagePath) {


  try {
    
    const imageOneParse =  path.parse(oldImagePath)
    const splitPath = imageOneParse.dir.split('/')

    let subfolder;
    let endfolder;

    if (splitPath.length === 5) {
      subfolder = splitPath[3]
      endfolder = splitPath[4]
    } else if (splitPath.length === 4) {
      endfolder = splitPath[3]
    }


    changeImageOne = await base64ToImageProduct(newImageBase64, subfolder, endfolder, `${imageOneParse.name}_1`)


    // delete old image


    const folderImage = path.join(process.cwd(), 'public', oldImagePath)
    const data = fs.unlinkSync(folderImage)
    console.log(data)
    return changeImageOne


  } catch (error) {
    
  }

}


// 


const categoryArr = [
  {
    item: 'Камеры',
    value: 'camera'
  },
  {
    item: 'Свет',
    value: 'light'
  },
  {
    item: 'Оптика',
    value: 'lens'
  },
  {
    item: 'Операторское оборудование',
    value: 'operator_equipment'
  },
]



const getAllProduct = async (req, res) => {
  try {

    const allProduct = await prisma.product.findMany()

    if (allProduct.length < 1 || !allProduct) {
      return res.status(200).json([])
    }

    return res.status(200).json(allProduct)

  } catch (error) {
    console.log(error)
    res.status(500).send({message: 'Не удалось получить списко оборудования' })

  }
}


const postProduct  = async  (req, res)  => {
  try {



    const data = req.body

    const {title, category, description, set, price, quantity, imageOne, imageTwo, imageThree} = req.body
    console.log(title, category, description, price, quantity)

    console.log(category)


    const currentCategory = categoryArr.find(item => item.value === category) ?? 'camera'
    console.log(currentCategory)


    let urlImageOne;
    let urlImageTwo;
    let urlImageThree;

    if (imageOne) {
      urlImageOne = base64ToImageProduct(imageOne, currentCategory.value, `folder_${title}`, `${title}_1`)
    }

    if (imageTwo) {
      urlImageTwo = base64ToImageProduct(imageTwo,  currentCategory.value, `folder_${title}`, `${title}_2`)
    }

    if (imageThree) {
      urlImageThree = base64ToImageProduct(imageThree, currentCategory.value, `folder_${title}`, `${title}_3`)
    }
    

    

    const newProduct = await prisma.product.create({
      data: {
        title: title,
        category: category,
        description: description,
        set: set,
        price: price,
        quantity: quantity,
        imageOne: urlImageOne ?? null,
        imageTwo: urlImageTwo ?? null,
        imageThree: urlImageThree ?? null
      }

    })


    console.log(newProduct)

    if (!newProduct) {
      return res.status(400).send({
        message: 'Product not created'
      })
    }


    return res.status(200).send({message: `Карточка товара успешно создана`})




  } catch (error) {
    console.log(error)
    res.status(5000).send({message:  'Internal Server Error' })

  }
}


const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const currentProduct = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!currentProduct) {
      return res.status(404).json({
        message: 'Такая карточка товара не найдена',
      });
    }

    if (currentProduct.imageOne) {
      const publicRoot = path.join(process.cwd(), 'public');

      // убираем ведущий слэш, чтобы path.join не "съел" public
      const relativeImagePath = currentProduct.imageOne.replace(/^\/+/, '');


      const filePath = path.join(publicRoot, relativeImagePath);
      const folderPath = path.dirname(filePath);
      const relativeToPublic = path.relative(publicRoot, folderPath);

      if (
        relativeToPublic &&
        !relativeToPublic.startsWith('..') &&
        relativeToPublic !== ''
      ) {
        if (fs.existsSync(folderPath)) {
          fs.rmSync(folderPath, { recursive: true, force: true });
          console.log('Удалена папка:', folderPath);
        } else {
          console.warn('Папка не найдена:', folderPath);
        }
      } else {
        console.warn('Опасный путь, удаление отменено:', folderPath);
      }
    }

    await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      message: `Карточка удалена ${currentProduct.title}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};




const patchProduct = async (req, res) => {
  try {

    const { id } = req.params


    const card = await req.body

    const currentProduct = await prisma.product.findFirst({
      where: {
        id: Number(id)
      }
    })

    if (!currentProduct) {
      return res.status(200).send({
        message: `Карточка продукта с таким id - ${id} не найдена`
      })
    }

    // console.log(currentProduct)



    let changeImageOne;
    let changeImageTwo;
    let changeImageThree;

  
    if (card.imageOne && currentProduct.imageOne) {
      changeImageOne = await patchImageFromFolder(card.imageOne, currentProduct.imageOne)
      console.log('imageOne ', changeImageOne)
      card.imageOne = changeImageOne
    }


   if (card.imageTwo && currentProduct.imageTwo)  {
      changeImageTwo = await patchImageFromFolder(card.imageTwo, currentProduct.imageTwo)
      console.log('imageTwo ', changeImageTwo)
      card.imageTwo = changeImageTwo
    }
    
    if (card.imageThree && currentProduct.imageThree) {
      changeImageThree = await patchImageFromFolder(card.imageThree, currentProduct.imageThree)
      console.log('imageThree ', changeImageThree)
      card.imageThree = changeImageThree
    }


    const changeProduct = await prisma.product.update({
      where: {
        id: Number(id)
      },

      data: card
    })


    if (!changeProduct) {
      return res.status(200).send({
        message: 'Не удалось обновить карточку продукта',
        sucess: false
      })
    }

    return res.status(200).send({
      message: 'Карточка продукта изменена',
      sucess: true
    })
    
  } catch (error) {
    console.log(error)
    res.status(500).send({message: 'Internal Server Error'})
  }
}



module.exports = { getAllProduct, postProduct, deleteProduct, patchProduct }