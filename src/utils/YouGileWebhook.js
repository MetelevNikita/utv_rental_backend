async function getYouGileWebhooks (url, key) {

  try {


    const response = await fetch(`${url}/webhooks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${key}`
      }
    })

    if (!response.ok) {
      throw new Error(`Сетевая ошибка при получении подписок ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    return data
    
  } catch (error) {
    console.log('ERROR YOUGILE GET WEBHOOK' + error.message)
    return {
      message: 'Error Yougile get webhook' + error.message,
      success: false
    }
  }
}



async function createYouGileWebhook (url, key, endpoint) {
  try {

    const response = await fetch(`${url}/webhooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        url: `${endpoint}/webhook`,
        event: 'task-*'
      })
    })

    if (!response.ok) {
      throw new Error(`Сетевая ошибка при создании ошибки ${response.status} - ${response.statusText}`)
    }
    
    const data = await response.json()
    return data
    
  } catch (error) {
    console.log('ERROR YOUGILE CREATE WEBHOOK' + error.message)
    return {
      message: 'Error Yougile create webhook' + error.message,
      success: false
    }
  }

}


async function deleteYouGileWebhook (url, key, id) {
  try {

    const response = await fetch(`${url}/webhooks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        deleted: true
      })
    })

    const data = await response.json()
    console.log(data)
    return data

  } catch (error) {
    console.log('ERROR YOUGILE CREATE WEBHOOK' + error.message)
    return {
      message: 'Error Yougile create webhook' + error.message,
      success: false
    }
  }
}




async function startYouGileWebhook () {

  const url = process.env.YG_URL
  const key = process.env.YG_KEY
  const urlWebhook = process.env.YG_WEBHOOK_URL


  if (!url || !key) {
    console.error('Не получены параметры Ключ или URL')
    throw new Error('Не получены параметры Ключ или URL')
  }


  const getWebHook = await getYouGileWebhooks(url, key)

  if (getWebHook.length < 1) {
      await createYouGileWebhook(url, key, urlWebhook)
      return
  }

  for (let item of getWebHook) {
    if (item.url !== `${urlWebhook}/webhook`) {
      console.log('Webhook Yougile не найден')
      await createYouGileWebhook(url, key, urlWebhook)
      return
    }
  }


  console.log('Webhook Yougile найден')

  const currentWebhook = getWebHook.find((item) => item.url == `${urlWebhook}/webhook`)
  return currentWebhook

}


module.exports = { startYouGileWebhook }



