const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  try {
    const findResult = await Category.find({});
    ctx.body = {categories: findResult};
  } catch (err) {
    ctx.throw(500);
  };
};
