
const formTeam = document.getElementById('form-team')

const teamUrl = 'https://utvls.tw1.su/api/v1/team'


console.log('v6.0')



formTeam.addEventListener('submit', async (e) => {
  e.preventDefault()

  try {

    const newFormTeam = new FormData()

    const name = document.getElementById('name-team').value
    const profession = document.getElementById('profession-team').value
    const file = document.getElementById('file-team').files[0]

    newFormTeam.append('name', name)
    newFormTeam.append('profession', profession)
    newFormTeam.append('file', file)


    console.log(...newFormTeam)


    const responce = await fetch(teamUrl, {
      method: 'POST',
      body: newFormTeam
    }
  )

  const data  = responce
  console.log(data)
  return data

  } catch (error) {

    console.log(error)

  }

})





// PRODUCT



const productUrl = 'http://localhost:8000/api/v1/product'


const categoryArr = ['Камеры', 'Свет', 'Звук', 'Операторское оборудование', 'Техника для трансляций']


const categorySelect = document.createElement('select')
categorySelect.setAttribute('name', 'category')
categorySelect.setAttribute('placeholder', 'Выберите категорию')
categorySelect.setAttribute('id', 'category-product')
categorySelect.setAttribute('class', 'form_input_select')
categorySelect.setAttribute('required','required')


// create select

categoryArr.map((item) => {
  const option = document.createElement('option')
  option.setAttribute('value', item)
  option.textContent = item
  categorySelect.appendChild(option)
});


const formProduct  = document.getElementById('form-product')


const descriptionProduct = document.getElementById('description-product')
formProduct.insertBefore(categorySelect, descriptionProduct)


let checkedSelect = 'Камеры'


categorySelect.addEventListener('change', (e)   =>   {
  console.log(e.target.value)

  return checkedSelect = e.target.value
})






formProduct.addEventListener('submit', async  (e)  =>  {
  e.preventDefault()

  try {

    const newFormProduct = new FormData()

    const titleProduct = document.getElementById('title-product').value
    const descriptionProduct = document.getElementById('description-product').value
    const priceProduct = document.getElementById('price-product').value
    const quantityProduct  = document.getElementById('quantity-product').value
    const file = document.getElementById('file-product').files[0]


    newFormProduct.append('title', titleProduct)
    newFormProduct.append('category', checkedSelect)
    newFormProduct.append('description', descriptionProduct)
    newFormProduct.append('price', priceProduct)
    newFormProduct.append('quantity', quantityProduct)
    newFormProduct.append('file', file)

    console.log(...newFormProduct)



    const responce = await fetch(productUrl,  {
      method: 'POST',
      body: newFormProduct
    })

    const data = responce
    console.log(data)
    return data


  } catch (error) {
    console.error(error)

  }
})



// PORTFOLIO



const portfolioUrl = 'https://utvls.tw1.su/api/v1/portfolio'

const categroyPortfolio = ['Конференции', 'Концерты', 'Спорт', 'Городские мероприятия']


const portfolioSelect  = document.createElement('select')
portfolioSelect.setAttribute('name', 'portfolio-select')
portfolioSelect.setAttribute('placeholder', 'Выберите категорию')
portfolioSelect.setAttribute('id', 'portfolio-select')
portfolioSelect.setAttribute('class', 'form_input_select')
portfolioSelect.setAttribute('required','required')



categroyPortfolio.map((item) => {
  const option = document.createElement('option')
  option.setAttribute('value', item)
  option.textContent = item
  portfolioSelect.appendChild(option)
});



let checkedSelectPortfolio = 'Конференции'

portfolioSelect.addEventListener('change', (e) => {
  return checkedSelectPortfolio  = e.target.value
})




const descriptionPortfolio = document.getElementById('description-portfolio')


const formPortfolio  = document.getElementById('form-portfolio')
formPortfolio.insertBefore(portfolioSelect, descriptionPortfolio)


formPortfolio.addEventListener('submit', async   (e)  =>  {
  e.preventDefault()

  try {

    const titlePortfolio  = document.getElementById('title-portfolio').value
    const descriptionPortfolio  = document.getElementById('description-portfolio').value
    const linkPortfolio  = document.getElementById('link-portfolio').value
    const file  = document.getElementById('file-portfolio').files[0]

    const newFormPortfolio  = new FormData()

    newFormPortfolio.append('title', titlePortfolio)
    newFormPortfolio.append('description', descriptionPortfolio)
    newFormPortfolio.append('link', linkPortfolio)
    newFormPortfolio.append('category', checkedSelectPortfolio)
    newFormPortfolio.append('file', file)


    console.log(...newFormPortfolio);

    const responce = await fetch(portfolioUrl,  {
      method: 'POST',
      body: newFormPortfolio
     })

     const data = responce
     console.log(data)
     return data


  } catch (error) {
    console.log(error)
  }
})







