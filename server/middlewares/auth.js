const jwt = require('jsonwebtoken')

//====================
// VALIDATE TOKEN
//====================
const ValidateToken = (req, res, next) => {

  const token = req.get('Authorization')

  if (!token) {
    return res.status(401).json({
      message: 'Usuario sin autorización'
    })
  }

  jwt.verify(token.split(' ')[1], process.env.TOKEN_SEED, (err, decoded) => {
    console.log(err)
    if (err) {
      return res.status(401).json({
        message: 'Usuario sin autorización'
      })
    }

    req.user = decoded
    next()
  })

};

const ValidateRol = (req, res, next) => {
  const user = req.user

  if (user.role !== 'ADMIN_ROLE') {
    console.log('entre')
    return res.status(401).json({
      message: 'Usuario no autorizado para realizar esta operación'
    })
  }

  next()
}

module.exports = {
  ValidateToken,
  ValidateRol
}