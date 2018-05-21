const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const middleWare = require('./middleware');
const cors = require('cors');
const User = require('./models/user');
const Todo = require('./models/todo');

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
  // TODO: Validate that we're being sent an email and a secure password.
  const { email } = req.body;
  const passwordHash = req.password;
  const newUser = new User({ email, passwordHash });
  newUser.save((err, savedUser) => {
    if (err) {
      if (err.code === 11000) {
        middleWare.sendUserError('Email already signed up.', res, 409);
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
  if (!email || !password) {
    middleWare.sendUserError('email/pass undefined', res);
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
          middleWare.sendUserError('Invalid email/pass. ', res);
          return;
        }
        req.session.email = email;
        req.user = user;
        // What else do I need to be sending back to manage sessions?
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
  req.session.destroy((err) => {
    if (err) middleWare.sendUserError(err, res, 500);
    res.json({ success: true });
  });
});

server.get('/me', middleWare.loggedIn, (req, res) => {
  res.json({ user: req.user, session: req.session });
});

// TODO: Proper error handling.
server.post('/todo', middleWare.loggedIn, (req, res) => {
  if (!req.body.content || !req.body.title) {
    middleWare.sendUserError('No proper todo supplied.', res);
    return;
  }
  const { title, content } = req.body;
  if (title.length > 51) {
    middleWare.sendUserError('Title too long.', res);
    return;
  } else if (content.length > 1025) {
    middleWare.sendUserError('Content too long.', res);
    return;
  }

  const newTodo = new Todo({ author: req.user._id, title, content });
  newTodo.save((err, savedTodo) => {
    if (err) {
      res.status(500).send({ success: false, err });
    } else res.json({ success: true, savedTodo });
  });
});

server.get('/todo', middleWare.loggedIn, (req, res) => {
  Todo.find({ author: req.user._id }, (err, todos) => {
    if (err) {
      res.status(500).send({ success: false, err });
    } else if (todos.length === 0) {
      res.json({ success: true, message: 'You have no todos yet!' });
    } else res.json(todos);
  });
});

// If request got to bottom of the file, it's invalid. Send 404.
server.use((req, res) => res.status(404).send('Invalid route path.'));
server.listen(3001);
