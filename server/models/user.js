const mongoose = require('mongoose')
const uniqueValidtor = require('mongoose-unique-validator')

const Schema = mongoose.Schema;

const allowedRoles = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '${VALUE} No es un rol válido'
}

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre de usuario es obligatorio']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'El correo electrónico es obligatorio']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },
  img: {
    required: false,
    type: String
  },
  role: {
    default: 'USER_ROLE',
    enum: allowedRoles,
    type: String
  },
  status: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
})

userSchema.methods.toJSON = function() {
  const user = this
  const userObject = user.toObject()
  delete userObject.password

  return userObject
}

userSchema.plugin(uniqueValidtor, {
  message: '{PATH} debe de ser único'
})

module.exports = mongoose.model('User', userSchema)