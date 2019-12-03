const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  description: {
    type: String,
    unique: true,
    required: [true, 'La descripción es obligatoria'] },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: Boolean,
    default: true
  }
});

categorySchema.methods.toJSON = function() {
  const category = this
  const categoryObject = category.toObject()
  delete categoryObject.status

  return categoryObject
}

module.exports = mongoose.model('Category', categorySchema);