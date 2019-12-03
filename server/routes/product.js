const express = require('express')
const _ = require('underscore')

const app = express()
const { ValidateToken } = require('./../middlewares/auth')

const Product = require('../models/product')

app.get('/products', ValidateToken, (req, res) => {

  Product.find({status: true})
    .sort('name')
    .populate('user', 'name email')
    .populate('category', 'description')
    .exec((err, products) => {

      if (err) {
        return res.status(500).json(err)
      }

      res.json(products)
    })

})

app.get('/products/:id', ValidateToken, (req, res) => {

  const id = req.params.id

  Product.findOne({_id: id})
    .populate('category')
    .populate('user', 'name email')
    .exec((err, product) => {

      if (err) {
        return res.status(500).json(err)
      }

      if (!product) {
        return res.status(404).json({
          message: 'El producto no existe'
        })
      }

      res.json(product)

    })

})

app.get('/products/search/:query', ValidateToken, (req, res) => {

  const query = req.params.query
  const regex = new RegExp(query, 'i')

  Product.find({ name: regex })
    .populate('user', 'name email')
    .populate('category', 'description')
    .exec((err, products) => {

      if (err) {
        return res.status(500).json(err)
      }

      return res.json(products)

    })


})

app.post('/products', ValidateToken, (req, res) => {

  const body = req.body

  const product = new Product({
    name: body.name,
    price: body.price,
    description: body.description,
    available: body.available,
    category: body.category,
    user: req.user.id
  })

  product.save((err, product) => {

    if (err) {
      return res.status(500).json(err)
    }

    if (!product) {
      return res.status(400).json(err)
    }

    res.status(201).json({
      message: 'Producto creado con éxito'
    })

  })

})

app.put('/products/:id', ValidateToken, (req, res) => {

  const id = req.params.id
  const body = _.pick(req.body, [ 'name', 'price', 'description', 'available', 'price' ])

  Product.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, updateProduct) => {

    if (err) {
      return res.status(500).json(err)
    }

    if(!updateProduct) {
      return res.status(404).json({ message: 'Producto no existe' })
    }

    res.status(202).json(updateProduct)

  })

})

app.delete('/products/:id', [ ValidateToken ], (req, res) => {

  const id = req.params.id

  Product.findByIdAndUpdate(id, { status: false }, (err, deleterProduct) => {
    if (err) {
      return res.status(500).json(err)
    }

    if(!deleterProduct) {
      return res.status(404).json({ message: 'Producto no existe' })
    }

    res.json({
      message: 'Producto eliminado con éxito'
    })
  })
})

module.exports = app