const fetch = require('node-fetch')
const express = require('express')
const cors = require('cors')

const app = express()
const port = 3001

const corsOptions = {
  origin: (origin, callback) => {
    const { CORS_WHITELIST, NODE_ENV } = process.env
    const isDev = NODE_ENV === 'development'
    const whiteList = CORS_WHITELIST.split(',')
    if (!origin ? isDev : whiteList.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/exchangerate', cors(corsOptions), async (req, res, next) => {
  const { EXCHANGE_RATE_API_KEY } = process.env
  const { base } = req.query
  try {
    const data =  await (await fetch(`https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/${base || 'USD'}`)).json()
    return res.send(data)
  } catch (err) {
    console.log(err)
    return res.send(err)
  }
})


app.listen(port, () => console.log(`App listening at http://localhost:${port}`))