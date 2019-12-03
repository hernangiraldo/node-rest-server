const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
      type: String,
      required: [true, 'El nombre es necesario']
    },
    price: {
      type: Number,
      required: [true, 'El precio únitario es necesario']
    },
    description: {
      type: String,
      required: false
    },
    available: {
      type: Boolean,
      required: true,
      default: true
    },
    status: {
      type: Boolean,
      default: true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
});

module.exports = mongoose.model('Product', productSchema);