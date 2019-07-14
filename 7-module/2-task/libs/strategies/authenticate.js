const User = require('../../models/User');

async function checkCreditals(email, displayName, done) {
  try {
    const findedUsers = await User.find({email: email});
    if (!findedUsers[0] || findedUsers.length > 1) {
      const newUser = await new User({email, displayName});
      await newUser.save();
      return done(null, newUser);
    };
    return done(null, findedUsers[0]);
  } catch (err) {
    return done(err, false);
  }
}

module.exports = function authenticate(strategy, email, displayName, done) {
  if (!email) return done(null, false, 'Не указан email');
  if (!displayName) return done(null, false, 'Не задано имя');
  checkCreditals(email, displayName, done)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        return done(err, false);
      });
};
