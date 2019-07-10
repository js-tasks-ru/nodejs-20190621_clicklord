const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  if (!ctx.query.subcategory.match(/^[0-9a-fA-F]{24}$/)) {
    ctx.status = 400;
    ctx.body = {products: []};
    return next();
  };
  try {
    const product = await Product.find({subcategory: {$in: ctx.query.subcategory}});
    if (!product) {
      ctx.status = 404;
      ctx.body = {products: []};
      return next();
    };
    ctx.body = {products: product};
  } catch (err) {
    ctx.throw(500);
  };
};

module.exports.productList = async function productList(ctx, next) {
  ctx.body = {products: []};
};

module.exports.productById = async function productById(ctx, next) {
  if (!ctx.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    ctx.status = 400;
    ctx.body = 'invalid id';
    return next();
  };
  try {
    const product = await Product.findById(ctx.params.id);
    if (!product) {
      ctx.status = 404;
      ctx.body = 'product not found by id';
      return next();
    };
    ctx.body = {product};
  } catch (err) {
    ctx.throw(500);
  };
};

