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

// Custom config files
var configKeys = require('./config/keys');

var pages = require('./routes/pages');
var users = require('./routes/users');
var api = require('./routes/api');
var admin = require('./routes/admin/pages');

var app = express();

mongoose.connect('mongodb://localhost:27017/babel');

// Configure passport for authentication
require('./config/auth')(passport);

// Use .html extention name for handlebars files
app.engine('html', exphbs({ extname: 'html', defaultLayout: 'main' }));
app.set('view engine', 'html');
// Prettify the json objects returned by setting the spaces
app.set('json spaces', 4);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: configKeys.SESSION_KEY }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


//
// ROUTES
//
app.use('/', pages);   
app.use('/api', api);
app.use('/users', users);
app.use('/admin', admin);


//
// ERRORS HANDLING
//

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
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
        message: err.message,
        error: {}
    });
});


module.exports = app;
