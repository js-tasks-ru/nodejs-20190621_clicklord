const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false},
    async function(username, password, done) {
      try {
        const findedUser = await User.findOne({email: username});
        if (!findedUser) {
          return done(null, false, 'Нет такого пользователя');
        };
        const validUserPasswd = await findedUser.checkPassword(password);
        if (!validUserPasswd) return done(null, false, 'Невереный пароль');
        return done(null, findedUser);
      } catch (err) {
        done(err, false);
      }
    }
);
