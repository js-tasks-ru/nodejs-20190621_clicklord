const Koa = require('koa');
const EventEmitter = require('events');
const chatEventEmitter = new EventEmitter();
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

router.get('/subscribe', async (ctx, next) => {
  try {
    ctx.body = await subscribeClient();
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

function subscribeClient() {
  return new Promise((resolve) => {
    chatEventEmitter.once('msg', (msg) => {
      resolve(msg);
    });
  });
};

module.exports = app;
