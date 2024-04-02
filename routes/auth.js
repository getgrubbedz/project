const express = require('express');
const crypto = require('crypto');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/User');

const router = express.Router();

passport.use(new LocalStrategy(async function verify(username, password, done) {
  try {
    const user = await User.findOne({where: {username: username}});
    if (!user) {
      return done(null, false, { message: 'Incorrect username or password.'});
    }
    crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', async function(err, hashedPassword) {
      if (err) { return done(err) }
      if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
        return done(null, false, {message: 'Incorrect username or password.'});
      }
      return done(null, user);
    });
  } catch (err) {
    console.error(err);
    return done(err);
  }
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findByPk(id).then(function(user) {
    done(null, user);
  });
});

router.get('/login', (req, res, next) => {
  if (req.user) {
    res.redirect(`/users/${req.user.username}`);
  } else {
    res.render('auth/login', {title: 'Login'});
  }
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login'
}));

router.get('/register', (req, res, next) => {
  if (req.user) {
    res.redirect(`/users/${req.user.username}`);
  } else {
    res.render('auth/register', {title: "Register"});
  }
});

router.post('/register', (req, res, next) => {
  console.log(req.body);
  let salt = crypto.randomBytes(16);
  crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function(err, hashedPassword){
    if (err) {
      console.error(err);
      res.status(500).send('Error registering user');
    }
    try {
      const user = await User.create({username: req.body.username, password: hashedPassword, salt: salt, first: req.body.first, last: req.body.last, email: req.body.email, role: 'None'});
      req.login(user, function(err) {
        if (err) {
          console.error(err);
          res.status(500).send('Error logging in');
        } else {
          res.redirect(`/users/${user.username}`);
        }
      })
    } catch (err) {
      console.error(err);
      res.status(500).send('Error registering user');
    }
  });
});

router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) {
      console.error(err);
      return next(err);
    }
    res.redirect('/');
  })
})

/*
  change password route
  only if logged in
  check current password
  if match, change password
  if not, error
*/

module.exports = router;