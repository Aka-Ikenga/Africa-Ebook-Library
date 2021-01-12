const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv  = require('dotenv');
const mongoose = require('mongoose');
const passport = require('passport');
const session  = require('express-session');
const MongoStore = require('connect-mongo')(session);

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const uploadRouter = require('./routes/upload');
const authRouter = require('./routes/auth');

// Database Connection
const connectDB = require('./config/db');

// Authentication
const {local} = require('./config/auth');
local(passport);

// setting up config files
dotenv.config({path:'./config/config.env'});
const PORT = process.env.PORT || 5000;

const app = express();

// connecting to Mongo Database
connectDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  secret: "My secret Key",
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/upload', uploadRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.post('/', (req, res) =>{

})
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV}  mode on ${PORT}`));
module.exports = app;
