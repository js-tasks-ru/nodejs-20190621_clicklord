const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const bodyData = {email, displayName} = ctx.request.body;
  bodyData.verificationToken = uuid();
  try {
    const newUser = await new User(bodyData);
    await newUser.setPassword(ctx.request.body.password);
    await newUser.save();
    await sendMail({
      template: 'confirmation',
      locals: {token: newUser.verificationToken},
      to: newUser.email,
      subject: 'Подтвердите почту',
    });
    ctx.body = {status: 'ok'};
    return next();
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = {};
      for (const field of Object.keys(err.errors)) {
        errors[field] = err.errors[field].message;
      }
      ctx.status = 400;
      ctx.body = {
        errors: errors,
      };
    } else {
      ctx.status = 500;
      ctx.body = err;
    };
    return next();
  };
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;
  try {
    const findedUser = await User.findOneAndUpdate(
        {verificationToken},
        {$unset: {verificationToken: null}});
    if (!findedUser) {
      ctx.status = 400;
      ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
      return next();
    };
    ctx.body = {token: uuid()};
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
    return next();
  };
};
