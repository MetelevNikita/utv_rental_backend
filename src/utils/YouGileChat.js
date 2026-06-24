
async function getYouGileChat (id, url) {
    try {

        const key = process.env.YG_KEY


        const response = await fetch(`${url}/chats/${id}/messages`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            }
        })

        const data = await response.json()
        return data
        
    } catch (error) {
        console.error(error.message)
        return error.message
    }
}


module.exports = { getYouGileChat }