const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const sequelize = require('./database');
const addAuthorization = require('./authorization');

sequelize.sync().then(() => console.log('database is ready'));

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const petsRouter = require('./routes/pets');
const usersRouter = require('./routes/users');

const app = express();

app.set('views', path.join(__dirname, 'views'));
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.hbs',
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'SECRETKEY', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

app.use('*', addAuthorization);

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/', petsRouter);
app.use('/', usersRouter);

module.exports = app;
