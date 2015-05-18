// Loading important modules
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var passport = require('passport');
var bcrypt = require('bcryptjs');
var multer = require('multer');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);

// Create the express app
var app = express();

// Custom config files
var configKeys = require('./config/config');

mongoose.connect(configKeys.DB_URL);

// Use .html extention name for handlebars files
app.engine('html', exphbs(
  { extname: 'html', 
  defaultLayout: 'main',
  helpers: {
    select: function(value, options) {
      return options.fn(this)
            .split('\n')
            .map(function(v) {
              var t = 'value="' + value + '"'
              return ! RegExp(t).test(v) ? v : v.replace(t, t + ' selected="selected"')
            })
            .join('\n') 
    }
  } 
}));
app.set('view engine', 'html');
// Prettify the json objects returned by setting the spaces
app.set('json spaces', 4);

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(multer({ dest: './uploads/',
                 inMemory: true, }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: configKeys.SESSION_KEY,
                  saveUninitialized: true,
                  resave: true,
                  cookie: { maxAge: 1000*60*60},
                  store: new MongoStore({
                    db: mongoose.connection.db,
                  }),
                }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

var pages = require('./routes/pages')(passport);
var api = require('./routes/api');

//
// ROUTES
//
// Expose the user object to templates
app.use(function(req, res, next) {
  res.locals.port = app.get('port');
  res.locals.static = process.env.APP || "";
  res.locals.user = req.user;
  next();
});
app.use('/', pages);   
app.use('/api', api);
//
// ERRORS HANDLING
//

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: 'Unexpected Server error',
    error: {}
  });
});


module.exports = app;
