const Pool  = require("../database/db");



const getUsers = async (req, res) => {

  try {
    const users = await Pool.query("SELECT * FROM users");

    if(users.rows.length < 1) {
      res.status(404).json({message: "No users found"});
      return
    }

    res.status(200).send(users.rows);

  } catch (error) {
    console.log(error);
    res.status(500).json({message:  'что то пошло не так' + error});
  }
}



const createUser = async  (req, res)  =>  {
  try  {
    const {name, email, password, verifyPassword}  = req.body;

    if(password!== verifyPassword) {
      res.status(400).json({message:  "Passwords do not match"});
      return
    }

    const newUser  = await Pool.query("INSERT INTO users (name, email, password, verifyPassword) VALUES ($1, $2, $3, $4) RETURNING *", [name, email, password, verifyPassword]);

    if(!newUser.rows[0])  {
      res.status(404).json({message:  "No user found"});
      return
    }

    console.log(newUser.rows[0]);
    res.status(200).send(newUser.rows[0]);
    res.status(200).redirect("/login");

  } catch  (error)  {
    console.log(error);
    res.status(500).json({message:   'что то пошло не так'})
  }

}


const deleteUser = async  (req, res)  =>  {
  const { id } = req.params;

  try {

    if(!id)  {
      res.status(400).json({message: "No user id provided"});
      return
    }

    const deleteUser = await Pool.query("DELETE FROM users WHERE id  =  $1",  [id]);
    res.status(200).send(deleteUser.rows);

  } catch (error) {
    console.log(error);
    res.status(500).json({message:   'что то пошло не так'})
  }
}



module.exports = {getUsers,createUser,deleteUser}