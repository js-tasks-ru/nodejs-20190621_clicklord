const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    if (!socket.handshake.query.token) {
      return next(new Error('anonymous sessions are not allowed'));
    };
    const findedUser = await Session.findOne({token: socket.handshake.query.token})
        .populate('user');
    if (!findedUser) {
      return next(new Error('wrong or expired session token'));
    }
    socket.user = findedUser.user;
    next();
  });

  io.on('connection', function(socket) {
    socket.on('message', async (msg, callback) => {
      try {
        await saveMessageInBase(msg, socket);
        callback();
      } catch (err) {
        callback(err);
      };
    });
    socket.on('error', (error) => {
      socket.emit('message', error);
    });
  });

  return io;
}

async function saveMessageInBase(msg, socket) {
  try {
    const newMsg = await new Message({
      date: new Date(),
      text: msg.toString(),
      chat: socket.user.id,
      user: socket.user.displayName,
    });
    await newMsg.save();
  } catch (err) {
    throw err;
  }
}

module.exports = socket;
