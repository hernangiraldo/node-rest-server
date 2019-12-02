require('./config/config')

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(require('./routes'))

app.use(express.static(path.resolve(__dirname, '../public')))

mongoose.set('useCreateIndex', true)
mongoose.connect(process.env.URL_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err, resp) => {

  if (err) {
    throw err
  }

  console.log('Base de datos online')

})

app.listen(process.env.PORT, () => {
  console.log(`Escuchando en el puerto ${process.env.PORT}`)
})