'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var WordSchema = new Schema({
	username: String,
	word: String,
	atts: Array,
	// sample: String,
	date: String
});

WordSchema.path('word').validate(function (value, respond){
	var text = this;
	this.constructor.find({username: this.username, word: value}, function (err, word){
		if (err) {
			throw (err);
		};
		if (word) {
			return respond(false);
		};
		return respond(true);
	});
}, 'You have collected this word.');

module.exports = mongoose.model('collectedWord', WordSchema);