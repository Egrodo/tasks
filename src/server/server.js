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

// express.Router().use('/api', require('./api'));

server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  // And disable TODO: Is this needed?
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// Setup express-session secret and settings.
server.use(
  session({
    secret: 'correctHorseBatteryStaple',
    resave: true,
    saveUninitialized: true,
  }),
);

// Enable all CORS requests TODO: configure this properly instead of enable-all.
server.use(cors());

// Ensure that the user has permissions for whichever route they're requesting.
server.use(middleWare.restrictedPermissions);

// Start routes
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
        if (!response) throw new Error('Invalid password (no response).');
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

// If request got to bottom of the file, it's invalid. Send 404.
server.use((req, res) => {
  res.status(404).send('Invalid route path.');
});

server.listen(3001);
