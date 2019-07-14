const User = require('../../models/User');

async function checkCreditals(email, displayName, done) {
  try {
    const findedUser = await User.findOne({email: email});
    if (!findedUser) {
      const newUser = await new User({email, displayName});
      await newUser.save();
      return done(null, newUser);
    };
    return done(null, findedUser);
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
