const express = require('express')
const _ = require('underscore')

const app = express()
const { ValidateToken, ValidateRol } = require('./../middlewares/auth')

const Category = require('../models/category')

app.get('/categories', ValidateToken, (req, res) => {

  Category.find({status: true})
    .sort('description')
    .populate('user', 'name email')
    .exec((err, categories) => {
      if (err) {
        return res.status(500).json(err)
      }

      res.json(categories)
    })
})

app.get('/categories/:id', ValidateToken, (req, res) => {
  const id = req.params.id

  Category.findOne({_id: id}, (err, category) => {

    if (err) {
      return res.status(500).json(err)
    }

    if (!category) {
      return res.status(404).json({
        message: 'Caterogía no existe'
      })
    }

    res.json(category)

  })
})


app.post('/categories', [ ValidateToken ], (req, res) => {
  const body = req.body

  const category = new Category({
    description: body.description,
    user: req.user.id
  })

  category.save((err, category) => {

    if (err) {
      return res.status(500).json(err)
    }

    if (!category) {
      return res.status(400).json(err)
    }

    res.status(201).json({
      message: 'Categoría creada con éxito'
    })
  })
})

app.put('/categories/:id', [ ValidateToken ], (req, res) => {
  const id = req.params.id
  const body = _.pick(req.body, [ 'description' ])

  Category.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, category) => {
    if (err) {
      return res.status(400).json(err)
    }

    if (!category) {
      return res.status(404).json({ message: 'Categoría no existe' })
    }

    res.status(202).json(category)
  })
})

app.delete('/categories/:id', [ ValidateToken, ValidateRol], (req, res) => {
  const id = req.params.id

  Category.findByIdAndUpdate(id, { status: false }, (err, deletedCategory) => {
    if (err) {
      return res.status(400).json(err)
    }

    if(!deletedCategory) {
      return res.status(404).json({ message: 'Categoría no existe' })
    }

    res.json({
      message: 'Categoría eliminada con éxito'
    })
  })
})

module.exports = app