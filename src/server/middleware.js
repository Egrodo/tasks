const bcrypt = require('bcrypt');
const User = require('./user');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;


const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else res.json({ error: err });
};

// MiddleWares
const hashedPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    sendUserError('Gimme a password', res);
    return;
  }
  bcrypt
    .hash(password, BCRYPT_COST)
    .then((pw) => {
      req.password = pw;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const loggedIn = (req, res, next) => {
  const { username } = req.session;
  if (!username) {
    sendUserError('User is not logged in.', res);
    return;
  }

  User.findOne({ username }, (err, user) => {
    if (err) {
      sendUserError(err, res);
    } else if (!user) {
      sendUserError('User does not exist.', res);
    } else {
      req.user = user;
      next();
    }
  });
};

// If the path of the route includes 'restricted', ensure they're authorized (logged in).
const restrictedPermissions = (req, res, next) => {
  const path = req.path;
  if (/restricted/.test(path)) {
    if (!req.session.username) {
      sendUserError('User not authorized.', res);
      return;
    }
  }
  next();
};

module.exports = {
  sendUserError,
  hashedPassword,
  loggedIn,
  restrictedPermissions,
};
