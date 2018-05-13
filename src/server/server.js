const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const middleWare = require('./middleware');
const cors = require('cors');
const User = require('./user.js');

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
server.post('/signup', middleWare.hashedPassword, (req, res) => {
  // TODO: Validate that we're being send an email and a secure password.
  const { email } = req.body;
  const passwordHash = req.password;
  const newUser = new User({ email, passwordHash });
  newUser.save((err, savedUser) => {
    if (err) {
      if (err.code === 11000) {
        // If Mongo returns error "already created user"
        // BUG: The below line doesn't seem to be returning the json
        // ( I tried putting them on separate lines)
        res.status(409).json({ error: 'Email already signed up.' });
      } else {
        // Else TODO: handle other specific errors.
        res.status(422).json({ error: err.message });
      }
    } else {
      res.json(savedUser);
    }
  });
});

server.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    middleWare.sendUserError('email undefined', res);
    return;
  }
  User.findOne({ email }, (err, user) => {
    if (err || user === null) {
      middleWare.sendUserError('No user found at that id', res);
      return;
    }
    const hashedPw = user.passwordHash;
    bcrypt.compare(password, hashedPw)
      .then((response) => {
        if (!response) {
          res.status(422).json({ error: 'Invalid email/pass. ' });
          return;
        }
        req.session.email = email;
        req.user = user;
      })
      .then(() => {
        res.json({ success: true });
      })
      .catch(error => middleWare.sendUserError(error, res));
  });
});

server.post('/logout', (req, res) => {
  if (!req.session.email) {
    middleWare.sendUserError('User is not logged in', res);
    return;
  }
  req.session.email = null;
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
