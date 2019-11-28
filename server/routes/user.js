const express = require('express')
const bcrypt = require('bcrypt')
const _ = require('underscore')

const app = express()
const saltRounds = 10;

const User = require('../models/user')

app.get('/users', function (req, res) {
  const page = Number(req.query.page) || 0
  const skip = (page * 10) - 10
  User.find({ status: true }, 'name email role status google img')
    .skip(skip)
    .limit(10)
    .exec(async (err, data) => {
      if (err) {
        return res.status(400).json(err)
      }

      const response = await User.countDocuments({ status: true }, (err, total) => {
        let tmpResp;

        if (err) {
          tmpResp = res.status(500).json(err)
          return tmpResp
        }

        tmpResp =  res.json({
          data,
          total
        })
        return tmpResp
      })

      return response
    })
})

app.post('/users', function (req, res) {
  const body = req.body

  const user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, saltRounds),
    img: body.img,
    role: body.role,
  })

  user.save((err, userDB) => {
    if (err) {
      return res.status(400).json(err)
    }

    res.status(201).json(userDB)
  })
});

app.put('/users/:id', function (req, res) {
  const id = req.params.id
  const body = _.pick(req.body, [ 'name', 'email', 'img', 'status', 'role' ])

  User.findByIdAndUpdate(id, body, { new: true, runValidators: true },(err, userDB) => {
    if (err) {
      return res.status(400).json(err)
    }

    res.status(202).json(userDB)
  })
})

/*
Eliminaría el usuario de la base de datos pero eso no se debe hacer,
lo mejor es cambiarle el estado

  app.delete('/users/:id', function (req, res) {
  const id = req.params.id

    User.findByIdAndRemove(id, (err, deletedUser) => {
    if (err) {
      return res.status(400).json(err)
    }

    if(!deletedUser) {
      return res.status(400).json(Object.assign({}, err, { message: 'Usuario no existe' }))
    }

    res.json(deletedUser)
  })
})*/

app.delete('/users/:id', function (req, res) {
  const id = req.params.id

  User.findByIdAndUpdate(id, { status: false },(err, deletedUser) => {
    if (err) {
      return res.status(400).json(err)
    }

    if(!deletedUser) {
      return res.status(400).json({ message: 'Usuario no existe' })
    }

    res.json(deletedUser)
  })
})

module.exports = app