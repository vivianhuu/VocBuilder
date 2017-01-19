'use strict';
var express = require('express');
var _ = require('lodash');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./config');
var passport = require('passport');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var app = express();
var options = {
	db: {
		safe: true
	}
};
//connect database E-study
mongoose.connect('mongodb://localhost/E-study', options, function (err, res){
	if (err) {
		console.log('connection fail');
		console.log(err);
	} else {
		console.log('connection success');
	};
});

//referred files in components, module files in client
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.static(path.join(__dirname, '../node_modules')));
//template html files, for res.render()
app.set('views', path.join(__dirname, '../client/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(compression());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());
app.use(passport.initialize());
app.use(session({
	secret: config.secrets.session,
	resave: true,
	saveUninitialized: true,
	store: new mongoStore({mongooseConnection: mongoose.connection})
}));

//import routes
require('./routes')(app);

app.use(morgan('dev'));
app.use(errorHandler());

//create server on port 8080
app.listen(8080, function(){
	console.log('Express server listening on 8080.');
});

exports = module.exports = app;