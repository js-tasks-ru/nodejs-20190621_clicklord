const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false},
    async function(username, password, done) {
      try {
        const findedUsers = await User.find({email: username});
        if (!findedUsers[0] || findedUsers.length > 1) {
          return done(null, false, 'Нет такого пользователя');
        };
        const validUserPasswd = await findedUsers[0].checkPassword(password);
        if (!validUserPasswd) return done(null, false, 'Невереный пароль');
        return done(null, findedUsers[0]);
      } catch (err) {
        done(err, false);
      }
    }
);
