
const regSubmit = document.getElementById('reg_submit');
const regCansel = document.getElementById('reg_cansel');

console.log(regCansel)
console.log(regSubmit)

//

const registrationUrl = 'https://utvls.tw1.su/api/v1/registration';
const testUrl = 'http://localhost:8000/api/v1/registration'

console.log(registrationUrl)

regSubmit.addEventListener('click', async (e) => {
  e.preventDefault()

  try {

    const name =  document.getElementById('name').value;
    const email =  document.getElementById('email').value;
    const password =  document.getElementById('password').value;
    const verifyPassword =  document.getElementById('verifyPassword').value;


    if (!name ||!email ||!password ||!verifyPassword)  {
      alert('Please fill all the fields')
      return
    }

      const responce = await fetch(testUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'

        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          verifyPassword: verifyPassword
        })
      })


      const data = await responce.json()
      console.log(data)
      return data

  } catch (error) {
    console.log(error)
  }

})




regCansel.addEventListener('click',  (e)  =>  {
  e.preventDefault();
  console.log('click')

  window.location = '/login'
})


