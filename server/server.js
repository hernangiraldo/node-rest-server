require('./config/config')
const express = require('express')
const app = express()

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

let users = [
  {
    id: 1,
    name: 'Hernán Giraldo'
  },
  {
    id: 2,
    name: 'María Bautista'
  },
  {
    id: 3,
    name: 'Luka Abril'
  }
]

app.get('/users', function (req, res) {
  res.json(users)
})

app.post('/users', function (req, res) {
  users.push(req.body)
  res.json(users)
})

app.put('/users/:id', function (req, res) {
  users.push(req.body)
  res.json(users)
})

app.delete('/users/:id', function (req, res) {
  const id = req.params.id
  console.log(id)
  users = users.filter(u => u.id !== Number(id))
  res.json(users)
})

app.listen(process.env.PORT, () => {
  console.log(`Escuchando en el puerto ${process.env.PORT}`)
})