const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const User = require('./user.js');
const middleWare = require('./middleware');
const cors = require('cors');

const server = express();

// Parse JSON for requests using bodyParser.
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  // And disable caching?
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

server.use(
  session({
    secret: 'correctHorseBatteryStaple',
    resave: true,
    saveUninitialized: true,
  }),
);

server.use(cors());
server.use(middleWare.restrictedPermissions);

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    middleWare.sendUserError('username undefined', res);
    return;
  }
  User.findOne({ username }, (err, user) => {
    if (err || user === null) {
      middleWare.sendUserError('No user found at that id', res);
      return;
    }
    const hashedPw = user.passwordHash;
    bcrypt.compare(password, hashedPw)
      .then((response) => {
        // BUG: If I input the wrong password, it gives no response? Shouldn't it err?
        if (!response) throw new Error('No response from Bcrypt.');
        req.session.username = username;
        req.user = user;
      })
      .then(() => {
        res.json({ success: true });
      })
      .catch(error => middleWare.sendUserError(error, res));
  });
});

server.post('/signup', middleWare.hashedPassword, (req, res) => {
  const { username } = req.body;
  const passwordHash = req.password;
  const newUser = new User({ username, passwordHash });
  newUser.save((err, savedUser) => {
    if (err) {
      res.status(422);
      res.json({ 'Need both username and password': err.message });
      return;
    }

    res.json(savedUser);
  });
});

server.post('/logout', (req, res) => {
  if (!req.session.username) {
    middleWare.sendUserError('User is not logged in', res);
    return;
  }
  req.session.username = null;
  res.json(req.session);
});

// If logged in, return a list of users.
server.get('/restricted/users', (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      middleWare.sendUserError('500', res);
      return;
    }
    res.json(users);
  });
});

server.get('/me', middleWare.loggedIn, (req, res) => {
  res.send({ user: req.user, session: req.session });
});

server.listen(3000);
