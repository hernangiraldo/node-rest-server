const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

const User = require('../models/user')

app.post('/login', (req, res) => {

  const { email, password } = req.body

  User.findOne({ email: email }, (err, user) => {
    if (err) {
      return res.status(500).json(err)
    }

    if (!user) {
      return res.status(404).json({
        message: 'Usuario o contraseña incorrectos'
      })
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(404).json({
        message: 'Usuario o contraseña incorrectos'
      })
    }

    const token = jwt.sign({
      id: user._id,
      email: user.email,
      status: user.status,
      role: user.role
    }, process.env.TOKEN_SEED, { expiresIn: process.env.EXPIRATION_TOKEN })

    return res.json({
      user: user,
      token
    })

  })

})

module.exports = app