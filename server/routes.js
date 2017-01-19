'use strict';
var errors = require('./error');
var path = require('path');

module.exports = function(app){
	app.use('/:username/dashboard', require('./api/thing'));
	app.use('/:username', require('./api/user'));
	app.use('/:username/words', require('./api/words'));
	app.use('/:username/sentences', require('./api/sentenses'));
	app.use('/auth', require('./auth'));
	app.use('/api/translates', require('./api/translate'));
	app.route('/*').get(function (req, res){
		res.sendFile('index.html', {root: path.join(__dirname, '../client')});
	});
};