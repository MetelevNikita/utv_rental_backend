function message (data) {

    const dates = data.dates.split(',')
    const start = dates[0]
    const end = dates[1]

    const tg = `<b>Новая задача с сайта UtvRental.ru</b>\n\n\n<b>Имя заказчика</b>\n${data.name}\n\n<b>Телефон заказчика</b>\n${data.phone}}\n\n<b>Комментарий к заказу</b>\n${data.comment}\n\n<b>Даты аренды</b>\n${new Date(start).toLocaleDateString('RU-ru')}-${new Date(end).toLocaleDateString('RU-ru')}\n\n<b>Список оборудования</b>\n${data.orderList}\n\n<b>Цена аренды</b>\n${data.price}}р\n\n<b>*Дата создания карточки пррграммой</b>\n\n${new Date().toLocaleDateString('RU-ru')} - ${new Date().toLocaleTimeString('RU-ru', {
        hour: "2-digit",
        minute: "2-digit"
    })}`
  


    const yg = `<strong>Новая задача с сайта UtvRental.ru</strong><br><br><br><strong>Имя заказчика</strong>\n${data.name}<br><br><strong>Телефон заказчика</strong><br>${data.phone}}<br><br><strong>Комментарий к заказу</strong><br>${data.comment}<br><br><strong>Даты аренды</strong><br>${new Date(start).toLocaleDateString('RU-ru')}-${new Date(end).toLocaleDateString('RU-ru')}<br><br><strong>Список оборудования</strong><br>${data.orderList}}<br><br><strong>Цена аренды</strong><br>${data.price}}р<br><br> <br><br><strong>Дата выхода</strong><br><br><strong>*Дата создания карточки пррграммой</strong><br><br>${new Date().toLocaleDateString('RU-ru')} - ${new Date().toLocaleTimeString('RU-ru', {
        hour: "2-digit",
        minute: "2-digit"
    })}`


    return {tg, yg}

}

module.exports = {message}