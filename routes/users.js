const express = require('express');
const User = require('../models/User');

const router = express.Router();

//router.use('/api', apiRouter);

router.get('/users', async (req, res, next) => {
  if (req.user) {
    if (req.auth.usermgmt) {
      const users = await User.findAll({raw: true});
      res.render('users/userList', { title: "User Management", users: users, auth: req.auth });
    } else {
      res.status(401).send('Not Authorized');
    }
  } else {
    res.redirect('/');
  }
});

router.get('/users/new', (req, res, next) => {
  res.redirect('/users');
});

router.get('/users/:username', async (req, res, next) => {
  if (req.user) {
    const username = req.params.username;
    if (req.auth.user === username || req.auth.usermgmt){
      const user = await User.findOne({where: {username: req.params.username}, raw: true});
      res.render('users/userDetails', {title: user.username, user: user, auth: req.auth})
    } else {
      res.status(401).send('Not Authorized');
    }
  } else {
    res.redirect('/');
  }
});

router.post('/users/:username', async (req, res, next) => {
  if (req.user) {
    const username = req.params.username;
    if (req.auth.user !== username && req.auth.usermgmt){
      const { first, last, email, role } = req.body;
      const user = await User.findOne({where: {username: username}});
      user.set({
        first: first,
        last: last,
        email: email,
        role: role
      });
      user.save();
      res.redirect(`/users/${username}`);
    } else if (req.auth.user === username) {
      const { first, last, email } = req.body;
      const user = await User.findOne({where: {username: username}});
      user.set({
        first: first,
        last: last,
        email: email,
      });
      user.save();
      res.redirect(`/users/${username}`);
    } else {
      res.status(401).send('Not Authorized');
    }
  } else {
    res.redirect('/');
  }
});

router.get('/users/:username/edit', async (req, res, next) => {
  if (req.user) {
    const username = req.params.username;
    if (req.auth.user === username || req.auth.usermgmt){
      const user = await User.findOne({where: {username: username}, raw: true});
      res.render('users/updateUser', {title: `Update ${user.username}`, user: user, auth: req.auth});
    } else {
      res.status(401).send('Not Authorized');
    }
  } else {
    res.redirect('/');
  }
});

router.get('/users/:username/delete', async (req, res, next) => {
  if (req.user) {
    const username = req.params.username;
    if (req.auth.user !== username && req.auth.usermgmt){
      const user = await User.findOne({where: {username: req.params.username}});
      await user.destroy();
      res.redirect('/users');
    } else {
      res.status(401).send('Not Authorized');
    }
  } else {
    res.redirect('/');
  }
});

module.exports = router;