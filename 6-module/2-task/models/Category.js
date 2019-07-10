const mongoose = require('mongoose');
const connection = require('../libs/connection');

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  }
});

subCategorySchema.virtual('id').get(function(){
  return this._id.toHexString();
});

subCategorySchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) {   delete ret._id  }
});

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  
  subcategories: [subCategorySchema]
});

categorySchema.virtual('id').get(function(){
  return this._id.toHexString();
});

categorySchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) {   delete ret._id  }
});

module.exports = connection.model('Category', categorySchema);
