const NodeCache = require( "node-cache" );

const CACHE_DATA = {
  YOUGILE_KEY: 'KEY'
}

const cache = new NodeCache({
  stdTTL: 600,
  checkperiod: 60
})




const url = 'https://ru.yougile.com/api-v2'

async function youGileCompany () {
  try {
    const responce = await fetch(`${url}/auth/companies`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        login: process.env.YG_LOGIN,
        password: process.env.YG_PASSWORD
      })
    })

    if (!responce.ok) {
      return {
        message: 'Ошибка получения компаний YouGile',
        success: false
      }
    }

    const data = await responce.json()
    const currentCompany = data.content.find(item => item.name == 'Технический отдел') ?? {}

    return currentCompany.id

  } catch (error) {
    console.log('ERROR YOUGILE ' + error.message)
    return {
      message: 'Error Yougile ' + error.message,
      success: false
    }
  }
}

async function youGileKey (companyId) {
  try {
    const responce = await fetch(`${url}/auth/keys/get`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        login: process.env.YG_LOGIN,
        password: process.env.YG_PASSWORD,
        companyId: companyId.toString()
      })

    })

    if (!responce.ok) {
      return {
        message: 'Ошибка получения ключей YouGile ' + responce.statusText,
        success: false
      }
    }

    const data = await responce.json()
    return data

  } catch (error) {
    console.log('ERROR YOUGILE ' + error.message)
    return {
      message: 'Error Yougile ' + error.message,
      success: false
    }
  }
}

async function createYouGileKey (companyId) {
  try {
    const responce = await fetch(`${url}/auth/keys`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        login: process.env.YG_LOGIN,
        password: process.env.YG_PASSWORD,
        companyId: companyId
      })
    })

    if (!responce.ok) {
      return {
        message: 'Ошибка создания ключа YouGile',
        success: false
      }
    }

    const data = await responce.json()
    return data

  } catch (error) {
    console.log('ERROR YOUGILE ' + error.message)
    return {
      message: 'Error Yougile ' + error.message,
      success: false
    }
  }
}

// res function

async function getYouGileKey() {
  
  try {

    const companyId = await youGileCompany()

    if (!companyId) return {
        message: 'ERROR GET COMPANY YOUGILE',
        success: false
      }

    const youGileKeys = await youGileKey(companyId)

    if (!youGileKeys) {
      return {
        message: 'ERROR GET KEYS YOUGILE',
        success: false
      }
    }

    if (youGileKeys.length < 1) {
      const newKey = await createYouGileKey(companyId)
      console.log('Новый ключ YouGile создан')
      return newKey[0]
    } else {
      console.log('Ключ YouGile получен из базы')
      return youGileKeys[0]
    }

    
  } catch (error) {
    console.log('ERROR YOUGILE ' + error.message)
    return {
      message: 'Error Yougile ' + error.message,
      success: false
    }
  }
}



async function getYgKeyCache () {


  if (cache.has(CACHE_DATA.YOUGILE_KEY)) {
    console.info('Данные Ключа получены из Кэша')
    return cache.get(CACHE_DATA.YOUGILE_KEY)
  }
  // 
  console.info('Данные ключа получаем из АПИ yougile')

  const companyId = await youGileCompany()
  console.log(companyId)

  if (!companyId) return {
      message: 'ERROR GET COMPANY YOUGILE',
      success: false
  }

  const youGileKeys = await youGileKey(companyId)

  if (!youGileKeys) {
    return {
      message: 'ERROR GET KEYS YOUGILE',
      success: false
    }
  }

  if (youGileKeys.length < 1) {
    const newKey = await createYouGileKey(companyId)
    console.log('Новый ключ YouGile создан')
    cache.set(CACHE_DATA.YOUGILE_KEY, newKey[0])
    return newKey[0]
  } else {
    console.log('Ключ YouGile получен из базы')
    cache.set(CACHE_DATA.YOUGILE_KEY, youGileKeys[0])
    return youGileKeys[0]
  }


}






module.exports = { getYgKeyCache }