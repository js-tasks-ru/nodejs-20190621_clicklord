const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  try {
    const product = await Product.find({$text: {$search: ctx.query.query}},
        {score: {$meta: 'textScore'}})
        .sort({score: {$meta: 'textScore'}});
    if (!product) {
      ctx.body = {products: []};
      return next();
    };
    ctx.body = {products: product};
  } catch (err) {
    ctx.throw(500);
  };
};
