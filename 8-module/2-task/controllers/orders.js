const Order = require('../models/Order');

module.exports.checkout = async function checkout(ctx, next) {
  if (!ctx.request.body) {
    ctx.status = 400;
    ctx.body = 'empty body';
    return;
  };
  const newOrder = new Order({
    user: ctx.user._id,
    product: ctx.request.body.product,
    phone: ctx.request.body.phone,
    address: ctx.request.body.address,
  });
  await newOrder.save();
  ctx.status = 201;
  ctx.body = {
    order: newOrder._id,
  };
  return next();
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  try {
    const findedOrders = await Order.find({user: ctx.user._id}).populate('product');
    ctx.status = 200;
    ctx.body = {orders: findedOrders.map((order) => {
      return order.toJSONFor();
    })};
    return next();
  } catch (err) {
    ctx.status = 500;
    ctx.body = {error: 'Internal server error'};
  };
};
