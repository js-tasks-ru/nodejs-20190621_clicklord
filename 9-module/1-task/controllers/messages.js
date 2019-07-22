const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  try {
    const findedMessages = await Message.find({chat: ctx.user.id}).limit(20);
    if (findedMessages.length === 0 || !findedMessages) {
      ctx.body = {
        messages: [],
      };
      return next();
    };
    ctx.body = {
      messages: findedMessages.map((value) => {
        return value.toJSONFor();
      }),
    };
  } catch (err) {
    ctx.throw(500, 'Internal server error');
  };
};
