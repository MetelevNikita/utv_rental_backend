const path = require('path')
const fs = require('fs')


// politic


 const politicControllerGet = async (req, res, politicPath, params) => {
        try {


            if (!fs.existsSync(politicPath)) {
                console.log('Папка politic отсутсвует, создаем новую')
                fs.mkdirSync(politicPath)
            }

            const currentDocsFolder = path.join(politicPath, params)

            if (!fs.existsSync(currentDocsFolder)) {
                res.status(200).send({
                    message: 'Папка не обнаружена'
                })
            }

            const files = fs.readdirSync(currentDocsFolder)

            if (!Array.isArray(files) || files.length < 1) {
                res.status(200).send({
                    success: false,
                    data: 'Папка пустая'
                })

                return
            }

            const currentFile = files.at(-1)

            console.log(currentFile)
            const pathToFile = path.join(currentDocsFolder, currentFile)
            res.status(200).sendFile(pathToFile)
            
        } catch (error) {
            console.log(error)
            res.status(500).send({message: 'Не удалось получить список комплектов' })
        }
}




// 




const docsController = (req, res) => {

    const { endpoint } = req.params
    console.log(endpoint)

    const politicPath = path.join(process.cwd(), 'public', 'docs')
    return politicControllerGet(req, res, politicPath, endpoint)
}




module.exports = { docsController }