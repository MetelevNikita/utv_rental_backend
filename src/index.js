const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser  = require('cookie-parser');
const dotenv = require('dotenv');




dotenv.config({
  path: path.resolve(process.cwd(), '../env')
})

// module

const { telegramBot } = require('./utils/TelegramBot.js')

// 

const { getYgKeyCache } = require('./utils/YouGileKey.js')
const { startYouGileWebhook } = require('./utils/YouGileWebhook.js')

//



// 




const registrationRouter = require('./Router/registrationRouter')
const loginRouter  = require('./Router/loginRouter')
const teamRouter = require('./Router/teamRouter')
const productRouter = require('./Router/productRouter')
const portfolioRouter = require('./Router/portfolioRouter')
const packRouter = require('./Router/packRouter.js')
const ordersRouter = require('./Router/ordersRouter.js')
const webhookRouter = require('./Router/webhookRouter.js')
const bidRouter = require('./Router/bidRouter.js')

// 

const feedbackRouter = require('./Router/feedbackRouter')


// politic

const docsRouter = require('./Router/docsRouter.js')

//

const app = express();


const publicPath = path.join(__dirname, '../public');
const appPath = path.join(__dirname, '../../app/build')
const adminPath = path.join(__dirname, '../../admin/build')


// Проверяем существование папок
const fs = require('fs');
if (!fs.existsSync(publicPath)) {
  console.warn('⚠️ Папка public не найдена:', publicPath);
}
if (!fs.existsSync(appPath)) {
  console.warn('⚠️ Папка frontend/build не найдена. Сначала выполните npm run build в папке frontend');
}


// use


app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended:  true}));
app.use(cookieParser());

//


// middleware

const authJwtToken = require('./middleware/authJwtToken');
const redirectToApp = require('./middleware/redirectApp.js')


// api router


app.use('/api/v1', registrationRouter);
app.use('/api/v1', loginRouter);
app.use('/api/v1', teamRouter);
app.use('/api/v1', productRouter);
app.use('/api/v1', portfolioRouter);
app.use('/api/v1', packRouter)
app.use('/api/v1', ordersRouter)
app.use('/api/v1', feedbackRouter)
app.use('/api/v1', docsRouter)
app.use('/api/v1', bidRouter)

app.use('/', webhookRouter)


if (fs.existsSync(adminPath)) {
  app.use(express.static(adminPath, {
    index: false
  }))
  console.log('✅ React admin build подключен');
}



if (fs.existsSync(appPath)) {
  app.use(express.static(appPath, {
    index: false
  }));
  console.log('✅ React app build подключен');
}

if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath, {
   index: false
  }))
}




app.use((req, res, next) => {
  console.log('🔍 Запрос:', req.method, req.url);
  next();
});


// app router


app.get('/', (req, res) => {
  res.sendFile(path.join(appPath, 'index.html'))
})


// public admin router

app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(adminPath, 'index.html'))
})

app.get('/admin/registration', (req, res) => {
  res.sendFile(path.join(adminPath, 'index.html'))
})

// protect admin router

app.get('/admin', authJwtToken, (req, res) => {
  res.sendFile(path.join(adminPath, 'index.html'))
})


app.get('/admin/*', authJwtToken, (req, res) => {
  res.sendFile(path.join(adminPath, 'index.html'))
})



// redirect into app SPA


app.get('/*', (req, res) => {
  res.sendFile(path.join(appPath, 'index.html'));
});



// listen


const PORT = process.env.PORT || 8000;


const startServer = async () => {

  try {

      const key = await getYgKeyCache()
      process.env.YG_KEY = key.key

      const webHooks = await startYouGileWebhook()
      console.log('WEBHOOKS ', webHooks)
  
     app.listen(PORT, (req, res) => {
      console.log(`Сервер стартовал с порта: ${PORT}`)
    });
  } catch (error) {
    console.log(error)
  }
}


startServer()