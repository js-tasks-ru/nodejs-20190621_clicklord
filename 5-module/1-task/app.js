const Koa = require('koa');
const {once, EventEmitter} = require('events');
const chatEventEmitter = new EventEmitter();
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

router.get('/subscribe', async (ctx, next) => {
  try {
    const [value] = await once(chatEventEmitter, 'msg');
    ctx.body = value;
  } catch (err) {
    ctx.body = err;
    ctx.throw(500);
  }
  return next();
});

router.post('/publish', async (ctx, next) => {
  if (!ctx.request.body.message) return next();
  try {
    chatEventEmitter.emit('msg', ctx.request.body.message);
    ctx.status = 200;
    ctx.body = '';
  } catch (err) {
    ctx.throw(500);
  }
  return next();
});

app.use(router.routes());

module.exports = app;
