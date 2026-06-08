
const { prisma } = require('../../lib/prisma.js')
const bcrypt = require('bcryptjs')


const getUsers = async (req, res) => {

  try {

    const allUsers = await prisma.user.findMany({})

    if (!allUsers) {
      res.status(200).json([])
    }

    res.status(200).json(allUsers)
    

  } catch (error) {
    console.log(error);
    res.status(500).json({message:  'что то пошло не так' + error});
  }
}


const createUser = async  (req, res)  =>  {
  try  {
    const {name, email, password, verifyPassword}  = req.body;
 

    if (!name || !email || !password) {
      return res.status(200).send({
          message: "Заполните все поля",
          success: false
      })
    }


    const allUsers = await prisma.user.findMany()

    const repeatEmail = allUsers.find((item) => item.email == email)
    console.log(repeatEmail)


    if (repeatEmail) {
      return res.status(200).send({
        message: `Пользователь с email - ${email} уже занят`,
        success: false
      })
    }


    if(password!== verifyPassword) {
      return res.status(200).send({
          message: "Пароли не совпадают",
          success: false
        });

    }


    const hashPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashPassword,
      }
    })

    if (!newUser) {
      return res.status(200).send({
        message: "Что то пошло не так. Пользователь не создан",
        success: false
      });
    }

    return res.status(200).send({
        message: "Пользователь зарегестрирован",
        success: true
      });


  } catch  (error)  {
    console.log(error);
    return res.status(500).json({message: 'что то пошло не так'})
  }

}


const deleteUser = async  (req, res)  =>  {
  const { id } = req.params;

  try {


    const deletedUser = await prisma.user.delete({
      where: {
        id: Number(id)
      }
    })

    if (!deletedUser) {
      res.status(404).json({
        message: 'USER NOT FOUND'
      })
    }

    res.status(200).json({message: 'Пользователь удален'})

  } catch (error) {
    console.log(error);
    res.status(500).json({message:   'что то пошло не так'})
  }
}



module.exports = {getUsers,createUser,deleteUser}