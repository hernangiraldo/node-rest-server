const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

// CONFIGURACIONES DE GOOGLE

async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();

  return {
    name: payload.name,
    email: payload.email,
    img: payload.img,
    google: true
  }
}

app.post('/login/google', async (req, res) => {

  const token = req.body.idtoken;

  if (token === undefined) {
    return res.status(401).json({
      message: 'Usuario no autorizado'
    })
  }

  let googleUser = null
  try {
    googleUser = await verify(token)
  } catch(e) {
    return res.status(403).json({
      message: 'Token inválido'
    })
  }

  User.findOne({ email: googleUser.email }, (err, user) => {

    if (err) {
      return res.status(500).json(err)
    }

    if (user && !user.google) {
      return res.status(400).json({
        message: 'El usuario se había registrado anteriormente sin Google'
      })
    }

    if (!user) {
      const newUser = new User()
      newUser.name = googleUser.name
      newUser.email = googleUser.email
      newUser.img = googleUser.img
      newUser.google = true
      newUser.password = ':)'

      newUser.save((err, createdUser) => {
        if (err) {
          return res.status(500).json(err)
        }

        const token = buildToken(createdUser)
        return res.status(201).json({
          user: createdUser,
          token
        })
      })
    } else {
      const token = buildToken(user)
      return res.json({
        user: user,
        token
      })
    }
  })

})

function buildToken(user) {
  const token = jwt.sign({
    id: user._id,
    email: user.email,
    status: user.status,
    role: user.role
  }, process.env.TOKEN_SEED, { expiresIn: process.env.EXPIRATION_TOKEN })

  return token;
}

module.exports = app