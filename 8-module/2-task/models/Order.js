const mongoose = require('mongoose');
const connection = require('../libs/connection');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  phone: {
    type: String,
    required: true,
    validate: [
      {
        validator(value) {
          return /\+?\d{6,14}/.test(value);
        },
        message: 'invalid phone',
      },
    ],
  },
  address: {
    type: String,
    required: true,
  },
});

orderSchema.methods.toJSONFor = function() {
  return {
    id: this._id,
    user: this.user,
    product: {
      id: this.product._id,
      title: this.product.title,
      images: this.product.images,
      category: this.product.category,
      price: this.product.price,
      description: this.product.description,
    },
    phone: this.phone,
    address: this.address,
  };
};

module.exports = connection.model('Order', orderSchema);
