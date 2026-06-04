const path = require('path')

// 

const { PrismaPg } = require('@prisma/adapter-pg')
const { PrismaClient } = require('../generated/prisma/client')

// 

const dotenv = require('dotenv').config({
  path: path.resolve(process.cwd(), '.env')
})

const connectionString = `${process.env.DATABASE_URL}`

// 

const adapter = new PrismaPg({connectionString})
const prisma = new PrismaClient({adapter})


prisma.$connect()
  .then(() => console.log('✅ Connected to database'))
  .catch(err => {
    console.error('❌ Database connection error:', err)
    process.exit(1)
  })



module.exports = { prisma }



// const { PrismaClient } = require('@prisma/client')

// const prisma = new PrismaClient({
//   log: ['query', 'error', 'warn'],
// })


// module.exports = prisma